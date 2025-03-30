import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { childId, goals } = await req.json();

    console.log(goals);

    // Check if childId and goals are valid
    if (!childId || !Array.isArray(goals)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Extract subjects and check for existing goals
    const subjects = goals.map((goal) => goal.subject);

    const existingGoals = await prisma.learningGoal.findMany({
      where: {
        userId: childId,
        subject: { in: subjects },
      },
    });

    if (existingGoals.length > 0) {
      return NextResponse.json({ error: 'Learning goals for these subjects already exist.' }, { status: 400 });
    }

    // Prepare new learning goals
    const newGoals = goals.map(({ subject, subtopics }) => ({
      userId: childId,
      subject,
      title: `Goal for ${subject}`,
      description: subtopics.join(', '), // Concatenated subtopics
      status: "Pending",
    }));

    // Insert into database
    await prisma.learningGoal.createMany({
      data: newGoals,
    });

    return NextResponse.json({ message: 'Learning goals saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving learning goals:', error);
    return NextResponse.json({ error: 'Failed to save learning goals' }, { status: 500 });
  }
}
