import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { BulkUpdatePresentationsSchema } from "~/validators/block";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; weekId: string }> },
) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const { weekId } = await params;

    if (!weekId) {
      throw new BadResponse("ID is required!");
    }

    const body = await request.json();
    const { presentations, deletedPresentations, newPresentations } =
      BulkUpdatePresentationsSchema.parse(body);

    if (deletedPresentations.length > 0) {
      await prisma.audio.deleteMany({
        where: {
          id: {
            in: deletedPresentations,
          },
        },
      });
    }

    if (newPresentations.length > 0) {
      await prisma.presentation.createMany({
        data: newPresentations.map(({ title, presentationLink }) => ({
          weekId,
          title,
          presentationLink,
        })),
      });
    }

    if (presentations.length > 0) {
      await Promise.all(
        presentations.map(({ id: audioId, title, presentationLink }) =>
          prisma.presentation.update({
            where: {
              id: audioId,
            },
            data: {
              title,
              presentationLink,
            },
          }),
        ),
      );
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Presentations updated successfully!",
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
