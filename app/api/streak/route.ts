import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const todayDate = new Date().toISOString().split("T")[0];

  // Check if the user has a streak entry
  let streakEntry = await prisma.streak.findUnique({ where: { userId } });

  if (!streakEntry) {
    // If no entry exists, create a new one with streak 1
    streakEntry = await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        lastActive: new Date(todayDate),
      },
    });

    return NextResponse.json({ streak: streakEntry.currentStreak });
  }

  // Extract last active date
  const lastActiveDate = streakEntry.lastActive.toISOString().split("T")[0];
  let newStreak = streakEntry.currentStreak;

  // Check streak continuity
  const diffInDays = Math.floor(
    (new Date(todayDate).getTime() - new Date(lastActiveDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 1) {
    newStreak += 1;
  } else if (diffInDays > 1) {
    newStreak = 1; // Reset streak
  }

  // Update streak and last active date
  const updatedStreak = await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      lastActive: new Date(todayDate),
    },
  });

  return NextResponse.json({ streak: updatedStreak.currentStreak });
}
