import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import {
  BadResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  handleErrors,
} from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { unblockUserSchema } from "~/validators/security";

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      role: "ADMIN",
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const { userId } = unblockUserSchema.parse(body);

    // Prevent admin from unblocking themselves (shouldn't be blocked anyway)
    if (userId === decodedUser.id) {
      throw new BadResponse("You cannot unblock yourself!");
    }

    // Find the user to unblock
    const userToUnblock = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        isBlocked: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!userToUnblock) {
      throw new NotFoundResponse("User not found!");
    }

    if (!userToUnblock.isBlocked) {
      throw new BadResponse("User is not blocked!");
    }

    // Unblock the user
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: false,
      },
      select: {
        id: true,
        email: true,
        isBlocked: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: {
          user: updatedUser,
        },
        info: {
          message: `User ${updatedUser.email} has been unblocked successfully`,
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
