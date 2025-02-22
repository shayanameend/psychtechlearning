import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { BulkUpdateFlashcardsSchema } from "~/validators/section";

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
    const { flashcards, deletedFlashcards, newFlashcards } =
      BulkUpdateFlashcardsSchema.parse(body);

    if (deletedFlashcards.length > 0) {
      await prisma.flashcard.deleteMany({
        where: {
          id: {
            in: deletedFlashcards,
          },
        },
      });
    }

    if (newFlashcards.length > 0) {
      await prisma.flashcard.createMany({
        data: newFlashcards.map(({ question, answer }) => ({
          question,
          answer,
          sectionId: id,
        })),
      });
    }

    if (flashcards.length > 0) {
      await Promise.all(
        flashcards.map(({ id: flashcardId, question, answer }) =>
          prisma.flashcard.update({
            where: {
              id: flashcardId,
            },
            data: {
              question,
              answer,
            },
          }),
        ),
      );
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Flashcards updated successfully!",
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
