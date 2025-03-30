import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch completed assignments for a user
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        console.log("Retrieved userId:", userId); // Logging the userId

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const completedAssignments = await prisma.completedAssignment.findMany({
            where: { userId: Number(userId) },
        });

        return NextResponse.json(completedAssignments, { status: 200 });
    } catch (error) {
        console.error("Error fetching completed assignments:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
