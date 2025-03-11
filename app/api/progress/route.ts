import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: "Authentication required." }),
        { status: 401 }
      );
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Token is missing." }),
        { status: 401 }
      );
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "1511");
    const userId = (decoded as any).userId;

    // Fetch total number of subtopics per category
    const categories = await prisma.category.findMany({
      include: {
        topics: {
          include: {
            subtopics: true,
          },
        },
      },
    });

    // Fetch completed subtopics by the user
    const completedSubtopics = await prisma.completedSubtopic.findMany({
      where: { userId },
      select: { subtopicId: true },
    });

    const completedSubtopicIds = new Set(completedSubtopics.map(cs => cs.subtopicId));

    // Calculate progress for each category
    const progressDetails = categories.map(category => {
      const allSubtopics = category.topics.flatMap(topic => topic.subtopics);
      const totalSubtopics = allSubtopics.length;
      const completedCount = allSubtopics.filter(subtopic => completedSubtopicIds.has(subtopic.id)).length;
      
      return {
        id: category.id,  // ✅ Match frontend structure
        categoryId: category.id,
        categoryName: category.name,
        completedSubtopics: completedCount,  // ✅ Add completed count
        totalSubtopics: totalSubtopics,      // ✅ Add total subtopics count
      };
    });

    return new Response(
      JSON.stringify(progressDetails),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching progress:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching progress." }),
      { status: 500 }
    );
  }
}
