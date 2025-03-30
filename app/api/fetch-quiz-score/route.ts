import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");

    // Validate parameters
    if (!quizId) {
      return NextResponse.json({ error: "Missing quizId" }, { status: 400 });
    }

    // Fetch all students
    const students = await prisma.userDetails.findMany({
      where: { role: "student" },
      select: { name: true },
    });

    // Fetch scores for the given quiz ID
    const scores = await prisma.score.findMany({
      where: { quizId: parseInt(quizId) },
      include: { quiz: true },
    });

    // Map student names to their scores
    const studentScores = students.map((student) => {
      const scoreRecord = scores.find((s) => s.studentName === student.name);
      return {
        studentName: student.name,
        quizId: parseInt(quizId),
        quizTitle: scoreRecord ? scoreRecord.quiz.title : "Unknown",
        score: scoreRecord ? scoreRecord.score : "Not Attempted",
      };
    });

    return NextResponse.json(studentScores, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz scores:", error);
    return NextResponse.json({ error: "Failed to fetch quiz scores" }, { status: 500 });
  }
}
