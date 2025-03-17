// pages/api/reset-password.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";  // Import bcrypt for password hashing

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();  // Get the email and new password from the request body

  try {
    // 1. Find the userDetails by email (not token)
    const userDetails = await prisma.userDetails.findFirst({
      where: { email },  // Find the user by email
      include: { user: true },  // Include the associated user information
    });

    if (!userDetails || !userDetails.user) {
      return new Response(
        JSON.stringify({ message: "User not found with that email." }),  // Respond with error if user is not found
        { status: 404 }
      );
    }

    // 2. Find the associated username using the userDetails
    const username = userDetails.user.username;

    // 4. Update the password for the corresponding user
    const updatedUser = await prisma.user.update({
      where: { username },  // Use the username to find the user to update
      data: { password: password },  // Update the password with the hashed version
    });

    return new Response(
      JSON.stringify({ message: "Password successfully updated." }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500 }
    );
  }
}
