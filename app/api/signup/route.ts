import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse request body
    const { name, email, role, username, password, phone } = await req.json();

    // Validate input
    if (!name || !email || !role || !username || !password || !phone) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Start a Prisma transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create UserDetails and associated User
      const userDetails = await prisma.userDetails.create({
        data: {
          name,
          email,
          role,
          phone,
          user: {
            create: {
              username,
              password, // Store the plain password (consider hashing it)
            },
          },
        },
        include: { user: true },
      });

      const userId = userDetails.userId;

      // Insert three progress records with progress 0
      const categoryIds = [1, 2, 3]; // Replace with actual category IDs
      for (const categoryId of categoryIds) {
        await prisma.progress.create({
          data: {
            id: (userId*3)-(3-categoryId),
            userId: userId,
            categoryId: categoryId,
            progress: 0, // Default progress value
          },
        });
      }

      return userId;
    });

    return NextResponse.json({ message: 'User registered successfully', userId: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
