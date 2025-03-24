import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { UpdateBlockSchema } from "~/validators/block";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const { id } = await params;

    if (!id) {
      throw new BadResponse("ID is required!");
    }

    const block = await prisma.block.findUnique({
      where: {
        id,
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
        weeks: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
            audios: {
              select: {
                id: true,
                title: true,
                audioLink: true,
                createdAt: true,
                updatedAt: true,
              },
            },
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

    if (!block) {
      throw new BadResponse("Block Not Found!");
    }

    return NextResponse.json(
      {
        data: { block },
        info: {
          message: "Block Fetched Successfully!",
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const { id } = await params;

    if (!id) {
      throw new BadResponse("ID is required!");
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
    } = UpdateBlockSchema.parse(body);

    const block = await prisma.block.update({
      where: {
        id,
      },
      data: {
        blockOrder,
        blockTitle,
        blockDescription,
        guideLink,
        guideDescription,
        weeksDescription,
        flashcardsDescription,
        sampleTestDescription,
        finalTestDescription,
      },
      select: {
        id: true,
        blockTitle: true,
        blockDescription: true,
        guideLink: true,
        guideDescription: true,
        weeksDescription: true,
        flashcardsDescription: true,
        sampleTestDescription: true,
        finalTestDescription: true,
        weeks: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
            audios: {
              select: {
                id: true,
                title: true,
                audioLink: true,
                createdAt: true,
                updatedAt: true,
              },
            },
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
    });

    if (!block) {
      throw new BadResponse("Block Not Found!");
    }

    return NextResponse.json(
      {
        data: { block },
        info: {
          message: "Block Updated Successfully!",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const { id } = await params;

    if (!id) {
      throw new BadResponse("ID is required!");
    }

    const block = await prisma.block.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!block) {
      throw new BadResponse("Block Not Found!");
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Block Deleted Successfully!",
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
