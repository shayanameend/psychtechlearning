import type { Role, User } from "@prisma/client";
import type { NextRequest } from "next/server";

import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import {
  BadResponse,
  ForbiddenResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  handleErrors,
} from "~/lib/error";
import { verifyToken } from "~/lib/jwt";
import { prisma } from "~/lib/prisma";

interface VerifyRequestParams {
  request: NextRequest;
  role?: Role;
  isVerified?: boolean;
}

async function verifyRequest({
  request,
  role,
  isVerified,
}: Readonly<VerifyRequestParams>) {
  try {
    const bearerToken = request.headers.get("authorization");

    if (!bearerToken) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const token = bearerToken.split(" ")[1];

    if (!token) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const decodedUser = (await verifyToken(token)) as User;

    if (role && decodedUser.role !== role) {
      throw new ForbiddenResponse("Forbidden!");
    }

    if (isVerified && !decodedUser.isVerified) {
      throw new BadResponse("User Not Verified!");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedUser.id,
      },
      select: {
        id: true,
        email: true,
        password: true,
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
      throw new NotFoundResponse("User Not Found!");
    }

    // Check if user is blocked
    if (user.isBlocked) {
      throw new ForbiddenResponse(
        "Your account has been blocked due to security violations. Please contact support for assistance.",
      );
    }

    return user;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedResponse("Token Expired!");
    }

    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedResponse("Invalid Token!");
    }

    handleErrors({ error });
  }
}

export { verifyRequest };
