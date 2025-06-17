import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      role: "ADMIN",
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit;

    // Build where clause
    const where = userId ? { userId } : {};

    // Get violations with user information
    const violations = await prisma.securityViolation.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isBlocked: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Get total count for pagination
    const totalCount = await prisma.securityViolation.count({ where });

    // Get users with violations summary
    const userViolationSummary = await prisma.user.findMany({
      where: {
        securityViolations: {
          some: {},
        },
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
        _count: {
          select: {
            securityViolations: true,
          },
        },
      },
      orderBy: {
        securityViolations: {
          _count: "desc",
        },
      },
    });

    return NextResponse.json(
      {
        data: {
          violations,
          userViolationSummary,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
        info: {
          message: "Security violations retrieved successfully",
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
