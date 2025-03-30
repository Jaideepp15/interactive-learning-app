import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient(); // Initialize Prisma Client

export async function GET(req: Request, context: { params: { category: string } }) {
    const { category } = await context.params;
    const id = Number(category)
    console.log("id:",id);

  if (!id) {
    return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
  }

  try {
    // Fetch topics within the category and their subtopics
    const topics = await prisma.topic.findMany({
      where: { categoryId: Number(id) },
      include: {
        subtopics: { select: { name: true } }, // Select only subtopic names
      },
    });

    // Flatten the subtopics into a single array
    const subtopics = topics.flatMap(topic => topic.subtopics.map(sub => sub.name));

    return NextResponse.json(subtopics, { status: 200 });
  } catch (error) {
    console.error("Error fetching subtopics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close the Prisma Client connection
  }
}
