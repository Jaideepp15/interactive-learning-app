import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Create a new assignment
export async function POST(req: Request) {
    try {
        const { title, description, dueDate, subject } = await req.json();

        if (!title || !description || !dueDate || !subject) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Find the largest existing assignment ID
        const lastAssignment = await prisma.assignment.findFirst({
            orderBy: { id: "desc" },
            select: { id: true },
        });

        const newId = lastAssignment ? lastAssignment.id + 1 : 1; // Increment or start from 1

        // Insert new assignment with manually assigned `id`
        const newAssignment = await prisma.assignment.create({
            data: {
                id: newId,
                title,
                description,
                openDate: new Date(), // Sets open date to today
                dueDate: new Date(dueDate),
                subject,
            },
        });

        return NextResponse.json(newAssignment, { status: 201 });
    } catch (error) {
        console.error("Error creating assignment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
