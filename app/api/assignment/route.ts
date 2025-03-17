import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const assignments = await prisma.assignment.findMany();
        return Response.json(assignments, { status: 200 });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return Response.json({ error: "Failed to fetch assignments" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
