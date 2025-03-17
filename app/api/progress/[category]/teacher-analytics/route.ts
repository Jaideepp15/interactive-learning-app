import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: Promise<{ category: string }> }) {
  try {
    // Await params before destructuring
    const { category } = await context.params;
    const parsedCategoryId = Number(category);

    if (isNaN(parsedCategoryId)) {
      console.error("Invalid category ID:", category);
      return new Response(JSON.stringify({ message: "Invalid category ID." }), { status: 400 });
    }


    // Extract Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Authentication required: No auth header");
      return new Response(JSON.stringify({ message: "Authentication required." }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error("Token is missing in Authorization header");
      return new Response(JSON.stringify({ message: "Token is missing." }), { status: 401 });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "1511");
    } catch (err) {
      console.error("Invalid token:", err);
      return new Response(JSON.stringify({ message: "Invalid token." }), { status: 403 });
    }


    // Fetch total number of subtopics in the category
    const totalSubtopics = await prisma.subtopic.count({
      where: { topic: { categoryId: parsedCategoryId } },
    });


    if (totalSubtopics === 0) {
      return new Response(JSON.stringify({ message: "No subtopics found in this category." }), { status: 404 });
    }

    // Fetch all students
    const students = await prisma.user.findMany({
      where: { role: "student" },
      select: {
        id: true,
        username: true,
      },
    });


    // Fetch all completed subtopics for the given category
    const completedSubtopics = await prisma.completedSubtopic.findMany({
      where: {
        userId: { in: students.map((s) => s.id) },
        subtopic: {
          topic: {
            categoryId: parsedCategoryId,
          },
        },
      },
      select: {
        userId: true,
        subtopic: {
          select: { name: true },
        },
      },
    });


    // Organize completed subtopics by student ID
    const studentProgressMap: { [key: number]: string[] } = {};
    for (const entry of completedSubtopics) {
      if (!studentProgressMap[entry.userId]) {
        studentProgressMap[entry.userId] = [];
      }
      studentProgressMap[entry.userId].push(entry.subtopic.name);
    }


    // Calculate progress for each student
    const studentProgress = students.map((student) => {
      const completedSubtopicNames = studentProgressMap[student.id] || [];
      const progressPercentage = totalSubtopics > 0 ? Math.round((completedSubtopicNames.length / totalSubtopics) * 100) : 0;

      return {
        id: student.id,
        name: student.username,
        progress: progressPercentage,
        subtopics: completedSubtopicNames,
      };
    });


    return new Response(JSON.stringify(studentProgress), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Internal server error:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), { status: 500 });
  }
}
