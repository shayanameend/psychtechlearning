import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { CreateWeekSchema } from "~/validators/week";

export async function GET(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const weeks = await prisma.week.findMany({
      orderBy: {
        weekOrder: "asc",
      },
      select: {
        id: true,
        weekOrder: true,
        weekTitle: true,
        weekDescription: true,
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
        weekUserNotes: {
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
        data: { weeks },
        info: {
          message: "Weeks Fetched Successfully!",
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
      weekOrder,
      weekTitle,
      weekDescription,
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
    } = CreateWeekSchema.parse(body);

    const week = await prisma.week.create({
      data: {
        weekOrder,
        weekTitle,
        weekDescription,
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
        weekTitle: true,
        weekDescription: true,
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
        data: { week },
        info: {
          message: "Week Created Successfully!",
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
