import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch users with role 'student' and their details
    const students = await prisma.user.findMany({
      where: { role: "student" },
      include: {
        user: true, // Include UserDetails
        child: {
          include: {
            parent: {
              include: {
                user: {
                  include: {
                    user: true // Include parent's UserDetails
                  }
                }
              }
            }
          }
        }
      }
    });

    // Format the response
    const formattedStudents = students.map((student) => ({
      id: student.id,
      username: student.username,
      name: student.user?.name || "Unknown",
      email: student.user?.email || "Unknown",
      phone: student.user?.phone || "Unknown",
      // Handle case where child record doesn't exist
      parent: student.child?.parent?.user
        ? {
            id: student.child.parent.user.id,
            username: student.child.parent.user.username,
            name: student.child.parent.user.user?.name || "Unknown",
            phone: student.child.parent.user.user?.phone || "Unknown",
            email: student.child.parent.user.user?.email || "Unknown",
          }
        : null,
    }));

    return NextResponse.json(formattedStudents, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}