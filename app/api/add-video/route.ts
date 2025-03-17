import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, url, subtopicId } = body;

        if (!name || !url || !subtopicId) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const newVideo = await prisma.video.create({
            data: {
                name,
                url,
                subtopicId
            }
        });

        return new Response(JSON.stringify(newVideo), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to add video" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
