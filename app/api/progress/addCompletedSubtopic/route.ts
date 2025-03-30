import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
      // Extract the token from headers
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const token = authHeader.split(" ")[1];
  
      // Ensure JWT_SECRET is defined
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return NextResponse.json(
          { message: "JWT_SECRET environment variable is missing" },
          { status: 500 }
        );
      }
  
      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (err) {
        return NextResponse.json({ message: "Invalid token" }, { status: 403 });
      }
  
      // Convert userId to a number
      const userId = Number((decoded as { userId: string }).userId);
  
      // Parse request body
      const { subtopicId } = await req.json();
      if (!subtopicId) {
        return NextResponse.json(
          { message: "Subtopic ID is required" },
          { status: 400 }
        );
      }
  
      // Check if the subtopic is already marked as completed
      const existingEntry = await prisma.completedSubtopic.findFirst({
        where: {
          userId,
          subtopicId,
        },
      });
  
      if (existingEntry) {
        return NextResponse.json(
          { message: "Subtopic already marked as completed" },
          { status: 200 }
        );
      }
  
      // Fetch the last inserted record
      const lastEntry = await prisma.completedSubtopic.findFirst({
        orderBy: { id: "desc" }, // Get the record with the highest ID
      });
  
      const newId = lastEntry ? lastEntry.id + 1 : 1; // If no records, start with 1
  
      // Mark subtopic as completed with a manually set ID
      await prisma.completedSubtopic.create({
        data: {
          id: newId, // Manually set the new ID
          userId,
          subtopicId,
        },
      });
  
      return NextResponse.json(
        { message: "Subtopic marked as completed" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { message: "Failed to mark subtopic as completed" },
        { status: 500 }
      );
    }
}
  
