import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { updateUserBlockStatusSchema } from "~/validators/auth";

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
      throw new BadResponse("User ID is required!");
    }

    // Prevent admin from blocking themselves
    if (id === decodedUser.id) {
      throw new BadResponse("You cannot block yourself!");
    }

    const body = await request.json();
    const { isBlocked } = updateUserBlockStatusSchema.parse(body);

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isBlocked,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        isBlocked: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isStudent: true,
            notify: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadResponse("User not found!");
    }

    return NextResponse.json(
      {
        data: { user },
        info: {
          message: `User ${isBlocked ? "blocked" : "unblocked"} successfully!`,
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
