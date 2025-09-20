import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { CreateBlockSchema } from "~/validators/block";

export async function GET(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const blocks = await prisma.block.findMany({
      where: {
        isPublished: decodedUser.role === "USER" ? true : undefined,
      },
      orderBy: {
        blockOrder: "asc",
      },
      select: {
        id: true,
        blockOrder: true,
        blockTitle: true,
        blockDescription: true,
        guideLink: true,
        guideDescription: true,
        weeksDescription: true,
        flashcardsDescription: true,
        sampleTestDescription: true,
        finalTestDescription: true,
        isPublished: true,
        isFlashcardsEnabled: true,
        isSampleTestEnabled: true,
        isFinalTestEnabled: true,
        weeks: {
          orderBy: {
            weekNumber: "asc",
          },
          select: {
            id: true,
            weekNumber: true,
            title: true,
            presentations: {
              select: {
                id: true,
                title: true,
                presentationLink: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            audios: {
              select: {
                id: true,
                title: true,
                audioLink: true,
                createdAt: true,
                updatedAt: true,
              },
            },
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
        },
        blockUserNotes: {
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
        data: { blocks },
        info: {
          message: "Blocks Fetched Successfully!",
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
      role: "ADMIN",
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const {
      blockOrder,
      blockTitle,
      blockDescription,
      guideLink,
      guideDescription,
      weeksDescription,
      flashcardsDescription,
      sampleTestDescription,
      finalTestDescription,
      weeks,
    } = CreateBlockSchema.parse(body);

    const block = await prisma.block.create({
      data: {
        blockOrder,
        blockTitle,
        blockDescription,
        guideLink,
        guideDescription,
        weeksDescription,
        weeks: {
          createMany: {
            data: weeks,
          },
        },
        flashcardsDescription,
        sampleTestDescription,
        finalTestDescription,
      },
      select: {
        id: true,
        blockOrder: true,
        blockTitle: true,
        blockDescription: true,
        guideDescription: true,
        guideLink: true,
        weeksDescription: true,
        flashcardsDescription: true,
        sampleTestDescription: true,
        finalTestDescription: true,
        isPublished: true,
        isFlashcardsEnabled: true,
        isSampleTestEnabled: true,
        isFinalTestEnabled: true,
        weeks: {
          orderBy: {
            weekNumber: "asc",
          },
          select: {
            id: true,
            weekNumber: true,
            title: true,
            presentations: {
              select: {
                id: true,
                title: true,
                presentationLink: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            audios: {
              select: {
                id: true,
                title: true,
                audioLink: true,
                createdAt: true,
                updatedAt: true,
              },
            },
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
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        data: { block },
        info: {
          message: "Block Created Successfully!",
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
