import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { BulkUpdateUserNotesSchema } from "~/validators/week";

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
    const { notes, deletedNotes, newNotes } =
      BulkUpdateUserNotesSchema.parse(body);

    if (deletedNotes.length > 0) {
      await prisma.userNote.deleteMany({
        where: {
          id: {
            in: deletedNotes,
          },
        },
      });
    }

    if (newNotes.length > 0) {
      await prisma.userNote.createMany({
        data: newNotes.map(({ content }) => ({
          content,
          weekId: id,
          userId: decodedUser.id,
        })),
      });
    }

    if (notes.length > 0) {
      await Promise.all(
        notes.map(({ id: noteId, content }) =>
          prisma.userNote.update({
            where: {
              id: noteId,
            },
            data: {
              content,
            },
          }),
        ),
      );
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "User notes updated successfully!",
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
