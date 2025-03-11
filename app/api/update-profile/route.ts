// /pages/api/update-profile.ts
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

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

    const updatedUserDetails = await prisma.userDetails.update({
      where: { userId },
      data: { name, email, phone },
    });

    return new Response(
      JSON.stringify({ message: "Profile updated successfully!", updatedUserDetails }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error updating profile." }),
      { status: 500 }
    );
  }
}
