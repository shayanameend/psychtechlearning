import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { UpdateWeekSchema } from "~/validators/week";

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

    const week = await prisma.week.findUnique({
      where: {
        id,
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

    if (!week) {
      throw new BadResponse("Week Not Found!");
    }

    return NextResponse.json(
      {
        data: { week },
        info: {
          message: "Week Fetched Successfully!",
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
      weekOrder,
      weekTitle,
      weekDescription,
      guideLink,
      guideDescription,
      audioLink,
      audioDescription,
      flashcardsDescription,
      sampleTestDescription,
      finalTestDescription,
    } = UpdateWeekSchema.parse(body);

    const week = await prisma.week.update({
      where: {
        id,
      },
      data: {
        weekOrder,
        weekTitle,
        weekDescription,
        guideLink,
        guideDescription,
        audioLink,
        audioDescription,
        flashcardsDescription,
        sampleTestDescription,
        finalTestDescription,
      },
      select: {
        id: true,
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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!week) {
      throw new BadResponse("Week Not Found!");
    }

    return NextResponse.json(
      {
        data: { week },
        info: {
          message: "Week Updated Successfully!",
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

    const week = await prisma.week.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!week) {
      throw new BadResponse("Week Not Found!");
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Week Deleted Successfully!",
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
