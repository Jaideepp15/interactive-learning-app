import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subject, difficulty, duration, questions } = body; // Updated 'timeLimit' -> 'duration'

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        subject,
        difficulty,
        duration, // Fixed field name
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: q.options,
            answer: q.answer,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
