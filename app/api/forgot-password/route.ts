import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();  // Accept email as input

  try {
    // Find userDetails by email (now using email)
    const userDetails = await prisma.userDetails.findFirst({
      where: { email },  // Use email to find the user
      include: { user: true },  // Include the associated user information
    });

    if (!userDetails) {
      return new Response(
        JSON.stringify({ message: "User not found with that email." }),  // Respond with an error if no user found
        { status: 404 }
      );
    }

    // Generate password reset token
    const resetToken = Math.random().toString(36).substr(2);  // A random token; you could improve this by using a more secure method

    // Send email with password reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jaideepp15@gmail.com",  // Your Gmail address
        pass: "zryc efyc lwxc slat",   // Replace with your generated App Password
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
 // Customize reset link to your domain

    await transporter.sendMail({
      from: "jaideepp15@gmail.com",  // Sender email
      to: userDetails.email,         // Recipient email (found from userDetails)
      subject: "Password Reset Request",  // Subject of the email
      text: `Click this link to reset your password: ${resetLink}`,  // Body text
    });

    return new Response(
      JSON.stringify({ message: "Password reset link sent to your email." }),
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
