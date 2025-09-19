import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { BulkUpdateFlashcardsSchema } from "~/validators/block";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; weekId: string }> },
) {
  try {
    const decodedUser = await verifyRequest({
      request,
      role: "ADMIN",
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const { id, weekId } = await params;

    if (!id || !weekId) {
      throw new BadResponse("Block ID and Week ID are required!");
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
          weekId,
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
