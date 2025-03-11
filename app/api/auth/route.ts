import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse request body
    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare the password with the hashed password stored in the database
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (user.password != password) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Ensure JWT_SECRET is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { message: "JWT_SECRET environment variable is missing" },
        { status: 500 }
      );
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "1h", // Adjust expiration as needed
    });

    // Return the token to the client (store in a cookie or localStorage on frontend)
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
