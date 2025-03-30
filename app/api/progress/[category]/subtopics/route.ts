import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { category: string } }) {
  try {
    const { category } = await context.params;

    const parsedCategoryId = Number(category);
    if (isNaN(parsedCategoryId)) {
      return NextResponse.json({ message: "Invalid category ID." }, { status: 400 });
    }

    // Extract Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Token is missing." }, { status: 401 });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "1511");
    } catch (err) {
      return NextResponse.json({ message: "Invalid token." }, { status: 403 });
    }

    const userId = (decoded as any).userId;

    // Fetch completed subtopics for the user in the given category
    const completedSubtopics = await prisma.completedSubtopic.findMany({
      where: {
        userId,
        subtopic: {
          topic: {
            categoryId: parsedCategoryId,
          },
        },
      },
      include: {
        subtopic: true,
      },
    });

    const subtopics = completedSubtopics.map(cs => ({
      id: cs.subtopic.id,
      name: cs.subtopic.name,
    }));


    return NextResponse.json(subtopics, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
