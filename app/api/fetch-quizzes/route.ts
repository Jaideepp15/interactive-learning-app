// app/api/fetch-quizzes/route.ts

import { PrismaClient } from '@prisma/client'; // Directly import PrismaClient
import { NextResponse } from 'next/server'; // Import NextResponse from next/server

// Instantiate the Prisma Client
const prisma = new PrismaClient();

// Async function to handle the API route
export async function GET() {
  try {
    // Use prisma client to fetch all quizzes
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true, // Optionally include related questions
      },
    });

    // Return the quizzes as JSON response using NextResponse
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error(error);
    // Return error message as JSON using NextResponse
    return NextResponse.json({ error: 'Error fetching quizzes' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects after the query
  }
}
