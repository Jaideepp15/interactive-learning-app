import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const SECRET_KEY = process.env.JWT_SECRET as string // Ensure you set this in `.env.local`

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1] // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number }
    const receiverId = decoded.id // Extract user ID from token

    const feedback = await prisma.feedback.findMany({
      where: { receiverId },
      orderBy: { createdAt: "desc" }, // Sort by newest first
    })

    return NextResponse.json(feedback, { status: 200 })
  } catch (error) {
    console.error("Error verifying token:", error)
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 })
  }
}
