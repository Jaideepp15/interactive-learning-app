import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, categoryId, imageUrl } = body;

        if (!name || !categoryId || !imageUrl) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const newTopic = await prisma.topic.create({
            data: {
                name,
                categoryId,
                imageUrl
            }
        });

        return new Response(JSON.stringify(newTopic), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to add topic" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
