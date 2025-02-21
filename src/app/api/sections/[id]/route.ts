import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { UpdateSectionSchema } from "~/validators/section";

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
      sectionOrder,
      sectionTitle,
      sectionDescription,
      guideLabel,
      guideLink,
      flashcardsLabel,
      sampleTestLabel,
      finalTestLabel,
    } = UpdateSectionSchema.parse(body);

    const section = await prisma.section.update({
      where: {
        id,
      },
      data: {
        sectionOrder,
        sectionTitle,
        sectionDescription,
        guideLabel,
        guideLink,
        flashcardsLabel,
        sampleTestLabel,
        finalTestLabel,
      },
      select: {
        id: true,
        sectionTitle: true,
        sectionDescription: true,
        guideLabel: true,
        guideLink: true,
        flashcardsLabel: true,
        sampleTestLabel: true,
        finalTestLabel: true,
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
        data: { section },
        info: {
          message: "Section Updated Successfully!",
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

    const section = await prisma.section.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    console.log("id", id);

    if (!section) {
      throw new BadResponse("Section Not Found!");
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Section Deleted Successfully!",
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
