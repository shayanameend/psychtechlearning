import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { CreateCourseSchema } from "~/validators/course";

export async function GET(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const courses = await prisma.course.findMany({
      orderBy: {
        courseOrder: "asc",
      },
      select: {
        id: true,
        courseOrder: true,
        courseTitle: true,
        courseDescription: true,
        guideLink: true,
        guideDescription: true,
        audioLink: true,
        audioDescription: true,
        flashcardsDescription: true,
        sampleTestDescription: true,
        finalTestDescription: true,
        flashcards: {
          select: {
            id: true,
            question: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        sampleTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        finalTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        courseUserNotes: {
          where: {
            userId: decodedUser.id,
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        data: { courses },
        info: {
          message: "Courses Fetched Successfully!",
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return handleErrors({ error });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const {
      courseOrder,
      courseTitle,
      courseDescription,
      guideLink,
      guideDescription,
      audioLink,
      audioDescription,
      flashcardsDescription,
      flashcards,
      sampleTestDescription,
      sampleTestQuestions,
      finalTestDescription,
      finalTestQuestions,
    } = CreateCourseSchema.parse(body);

    const course = await prisma.course.create({
      data: {
        courseOrder,
        courseTitle,
        courseDescription,
        guideLink,
        guideDescription,
        audioLink,
        audioDescription,
        flashcardsDescription,
        flashcards: {
          createMany: {
            data: flashcards,
          },
        },
        sampleTestDescription,
        sampleTestQuestions: {
          createMany: {
            data: sampleTestQuestions,
          },
        },
        finalTestDescription,
        finalTestQuestions: {
          createMany: {
            data: finalTestQuestions,
          },
        },
      },
      select: {
        id: true,
        courseTitle: true,
        courseDescription: true,
        guideDescription: true,
        guideLink: true,
        flashcardsDescription: true,
        sampleTestDescription: true,
        finalTestDescription: true,
        audioLink: true,
        audioDescription: true,
        flashcards: {
          select: {
            id: true,
            question: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        sampleTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        finalTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        data: { course },
        info: {
          message: "Course Created Successfully!",
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleErrors({ error });
  }
}
