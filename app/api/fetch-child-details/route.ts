import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
    const parentUserId = decoded.userId;  // Fix here

    
    if (!parentUserId) {
        console.log("Decoded:",decoded);
        return NextResponse.json({ error: "Invalid parent user ID" }, { status: 400 });
      }

    // Get parent and children data
    const parent = await prisma.parent.findUnique({
      where: { userId: parentUserId },
      include: {
        children: {
          include: {
            user: {
              include: {
                user: true,
                completedSubtopics: {
                  include: {
                    subtopic: {
                      include: {
                        topic: {
                          include: {
                            category: true
                          }
                        }
                      }
                    }
                  }
                },
                completedAssignments: {
                  include: {
                    assignment: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    // Extract all child user IDs
    const childUserIds = parent.children.map(child => child.userId);

    // Get quiz scores for all children
    const scores = await prisma.score.findMany({
      where: {
        studentName: {
          in: parent.children.map(child => 
            child.user.user?.name || "Unknown")
        }
      },
      include: {
        quiz: true
      }
    });

    // Group scores by student name
    const scoresByStudent = scores.reduce((acc, score) => {
      if (!acc[score.studentName]) {
        acc[score.studentName] = [];
      }
      acc[score.studentName].push({
        quizId: score.quizId,
        quizTitle: score.quiz.title,
        score: score.score
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Construct the final response
    const children = parent.children.map(child => {
      const name = child.user.user?.name || "Unknown";
      
      return {
        id: child.user.id,
        name: name,
        completedSubtopics: child.user.completedSubtopics.map(cs => ({
          subtopic: cs.subtopic.name,
          category: cs.subtopic.topic.category.name
        })),
        completedAssignments: child.user.completedAssignments.map(ca => ({
          title: ca.assignment.title,
          dueDate: ca.assignment.dueDate,
          submissionDate: ca.submissionDate
        })),
        quizScores: scoresByStudent[name] || []
      };
    });

    return NextResponse.json({ children }, { status: 200 });
  } catch (error) {
    console.error("Error fetching parent dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}