import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse request body
    const { name, email, role, username, password, phone, subject, children } = await req.json();

    // Validate input
    if (!name || !email || !role || !username || !password || !phone) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Start a Prisma transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create User and UserDetails
      const user = await prisma.user.create({
        data: {
          username,
          password, // Store the plain password (consider hashing it)
          role,
          user: {
            create: {
              name,
              email,
              phone,
              role
            },
          },
        },
      });

      const userId = user.id;

      // Insert three progress records with progress 0
      const categoryIds = [1, 2, 3]; // Replace with actual category IDs
      for (const categoryId of categoryIds) {
        await prisma.progress.create({
          data: {
            id: (userId * 3) - (3 - categoryId),
            userId: userId,
            categoryId: categoryId,
            progress: 0, // Default progress value
          },
        });
      }

      // If user is a teacher, retrieve categoryId from Category table using subject name
      if (role === 'teacher' && subject) {
        const category = await prisma.category.findUnique({
          where: { name: subject },
          select: { id: true },
        });

        if (!category) {
          throw new Error(`Subject "${subject}" does not exist in categories`);
        }

        // Insert teacher entry with the retrieved categoryId
        await prisma.teacher.create({
          data: {
            userId,
            subject: category.id,
          },
        });
      }

      // If user is a parent, insert parent-child relationships correctly
      if (role === 'parent' && Array.isArray(children) && children.length > 0) {
        // Fetch existing child user IDs
        const childUsers = await prisma.user.findMany({
          where: {
            username: { in: children },
            role: 'student', // Ensure they are students
          },
          select: { id: true },
        });
    
        const childIds = childUsers.map((child) => child.id);
    
        // If not all children exist, throw an error
        if (childIds.length !== children.length) {
          throw new Error('One or more child usernames are invalid or not registered.');
        }
    
        // Create the Parent entry and retrieve its ID
        const parent = await prisma.parent.create({
          data: {
            userId,
          },
          select: { id: true }, // Retrieve ID for child relation
        });
    
        // Insert children into the Child table
        await prisma.child.createMany({
          data: childIds.map((childId) => ({
            userId: childId,
            parentId: parent.id, // Correct reference
          })),
        });
      }

      return userId;
    });

    return NextResponse.json({ message: 'User registered successfully', userId: result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
