import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, topicId } = body;

        if (!name || !topicId) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const newSubtopic = await prisma.subtopic.create({
            data: {
                name,
                topicId
            }
        });

        return new Response(JSON.stringify(newSubtopic), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to add subtopic" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
