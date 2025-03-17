import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle file upload and store in the database
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const assignmentId = formData.get("assignmentId");
        const userId = formData.get("userId");

        if (!file || !assignmentId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Simulating file storage (Replace with actual file storage logic)
        const fileUrl = `/uploads/${file.name}`;

        // Insert into CompletedAssignment table with submissionDate
        const completedAssignment = await prisma.completedAssignment.create({
            data: {
                assignmentId: Number(assignmentId),
                userId: Number(userId),
                fileUrl: fileUrl,
                submissionDate: new Date(), // Record submission timestamp
            },
        });

        return NextResponse.json(completedAssignment, { status: 201 });
    } catch (error) {
        console.error("Error uploading assignment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
