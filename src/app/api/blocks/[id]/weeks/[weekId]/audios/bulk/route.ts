import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { BulkUpdateAudiosSchema } from "~/validators/block";

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

    const { weekId } = await params;

    if (!weekId) {
      throw new BadResponse("ID is required!");
    }

    const body = await request.json();
    const { audios, deletedAudios, newAudios } =
      BulkUpdateAudiosSchema.parse(body);

    if (deletedAudios.length > 0) {
      await prisma.audio.deleteMany({
        where: {
          id: {
            in: deletedAudios,
          },
        },
      });
    }

    if (newAudios.length > 0) {
      await prisma.audio.createMany({
        data: newAudios.map(({ title, audioLink }) => ({
          weekId,
          title,
          audioLink,
        })),
      });
    }

    if (audios.length > 0) {
      await Promise.all(
        audios.map(({ id: audioId, title, audioLink }) =>
          prisma.audio.update({
            where: {
              id: audioId,
            },
            data: {
              title,
              audioLink,
            },
          }),
        ),
      );
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Audios updated successfully!",
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
