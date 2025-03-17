import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(
        JSON.stringify({ message: "Authentication required." }),
        { status: 401 }
        );
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
        return new Response(
        JSON.stringify({ message: "Token is missing." }),
        { status: 401 }
        );
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "1511");
    const userId = (decoded as any).userId;

    // Fetch the teacher's details
    const teacher = await prisma.teacher.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            user: {
              select: { name: true }, // Fetch name from UserDetails
            },
          },
        },
      },
    });

    if (!teacher) {
      return new Response(JSON.stringify({ error: "Teacher not found" }), { status: 404 });
    }

    // Fetch the category name using the subject ID
    const category = await prisma.category.findUnique({
      where: { id: teacher.subject },
      select: { name: true },
    });

    return new Response(JSON.stringify({
      name: teacher.user?.user?.name || "Unknown",
      subject: category?.name || "Unknown",
      categoryid: teacher.subject
    }));
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
