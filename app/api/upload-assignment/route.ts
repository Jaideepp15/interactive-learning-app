import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const assignmentId = formData.get("assignmentId") as string | null;
        const userId = formData.get("userId") as string | null;

        if (!file || !assignmentId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Read file contents as Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Define file storage path
        const uploadDir = path.join(process.cwd(), "public/uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        // Save file to disk
        await fs.writeFile(filePath, fileBuffer);

        // Store file URL in the database
        const fileUrl = `/uploads/${fileName}`;

        // Insert record into CompletedAssignment table
        const completedAssignment = await prisma.completedAssignment.create({
            data: {
                assignmentId: Number(assignmentId),
                userId: Number(userId),
                fileUrl: fileUrl,
                submissionDate: new Date(),
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
