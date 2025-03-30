import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: "Authentication required." }),
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Token is missing." }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "1511");
    const userId = (decoded as any).userId;

    const userDetails = await prisma.userDetails.findUnique({
      where: { userId },
      select: { name: true, email: true, phone: true, role: true }, // Added 'role'
    });

    if (!userDetails) {
      return new Response(
        JSON.stringify({ message: "User details not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ ...userDetails, userId }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error fetching profile." }),
      { status: 500 }
    );
  }
}
