import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch students and their submission status for an assignment
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const assignmentId = searchParams.get("assignmentId");

        if (!assignmentId) {
            return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
        }

        // Fetch all students
        const students = await prisma.user.findMany({
            where: { role: "student" },
            select: { id: true, username: true }
        });

        // Fetch completed submissions for the assignment
        const completedSubmissions = await prisma.completedAssignment.findMany({
            where: { assignmentId: Number(assignmentId) },
            select: { userId: true, fileUrl: true, submissionDate: true }
        });

        // Fetch assignment details to check the due date
        const assignment = await prisma.assignment.findUnique({
            where: { id: Number(assignmentId) },
            select: { dueDate: true }
        });

        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const dueDate = new Date(assignment.dueDate);

        // Process students' submission status
        const studentSubmissions = students.map((student) => {
            const submission = completedSubmissions.find((s) => s.userId === student.id);
            let status = "Not Submitted";
            let fileUrl = null;

            if (submission) {
                fileUrl = submission.fileUrl;
                const submissionDate = new Date(submission.submissionDate);
                status = submissionDate > dueDate ? "Submitted (Late)" : "Submitted";
            }

            return { id: student.id, name: student.username, status, fileUrl };
        });

        return NextResponse.json(studentSubmissions, { status: 200 });

    } catch (error) {
        console.error("Error fetching assignment submissions:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
