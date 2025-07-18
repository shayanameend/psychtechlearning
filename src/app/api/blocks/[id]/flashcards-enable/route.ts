import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { UpdateBlockFlashcardsStatusSchema } from "~/validators/block";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const { id } = await params;

    if (!id) {
      throw new BadResponse("Block ID is required!");
    }

    const body = await request.json();
    const { isFlashcardsEnabled } =
      UpdateBlockFlashcardsStatusSchema.parse(body);

    const block = await prisma.block.update({
      where: {
        id,
      },
      data: {
        isFlashcardsEnabled,
      },
      select: {
        id: true,
        blockTitle: true,
        isFlashcardsEnabled: true,
      },
    });

    if (!block) {
      throw new BadResponse("Block not found!");
    }

    return NextResponse.json(
      {
        data: { block },
        info: {
          message: `Flashcards ${
            isFlashcardsEnabled ? "enabled" : "disabled"
          } successfully!`,
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
