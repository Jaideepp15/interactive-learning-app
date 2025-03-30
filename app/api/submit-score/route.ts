import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { quizId, studentName, score, totalQuestions } = await req.json();

    if (!quizId || !studentName || score === undefined || !totalQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const percentageScore = Math.round((score / totalQuestions) * 100);

    // Check if the user already has a score for this quiz
    const existingScore = await prisma.score.findFirst({
      where: {
        quizId,
        studentName,
      },
    });

    if (existingScore) {
      return NextResponse.json({ message: "Score already exists, no update needed" }, { status: 200 });
    }

    // Insert the new score
    await prisma.score.create({
      data: {
        quizId,
        studentName,
        score: percentageScore, // Store percentage score
      },
    });

    return NextResponse.json({ message: "Score submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
