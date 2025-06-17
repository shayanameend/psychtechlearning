import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { createSecurityViolationSchema } from "~/validators/security";

const VIOLATION_THRESHOLD = 3; // Block user after 3 violations

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const { type, description } = createSecurityViolationSchema.parse(body);

    // Get user agent and IP address for logging
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.ip ||
      undefined;

    // Create the security violation record
    const violation = await prisma.securityViolation.create({
      data: {
        type,
        description,
        userAgent,
        ipAddress,
        userId: decodedUser.id,
      },
    });

    // Count total violations for this user
    const violationCount = await prisma.securityViolation.count({
      where: {
        userId: decodedUser.id,
      },
    });

    // Check if user should be blocked
    let shouldBlock = false;
    if (violationCount >= VIOLATION_THRESHOLD) {
      await prisma.user.update({
        where: {
          id: decodedUser.id,
        },
        data: {
          isBlocked: true,
        },
      });
      shouldBlock = true;
    }

    return NextResponse.json(
      {
        data: {
          violation,
          violationCount,
          shouldBlock,
          threshold: VIOLATION_THRESHOLD,
        },
        info: {
          message: shouldBlock
            ? "Account blocked due to repeated security violations"
            : "Security violation logged",
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleErrors({ error });
  }
}

export async function GET(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    // Get violation count for the current user
    const violationCount = await prisma.securityViolation.count({
      where: {
        userId: decodedUser.id,
      },
    });

    // Get recent violations
    const recentViolations = await prisma.securityViolation.findMany({
      where: {
        userId: decodedUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        type: true,
        description: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        data: {
          violationCount,
          recentViolations,
          threshold: VIOLATION_THRESHOLD,
          isNearThreshold: violationCount >= VIOLATION_THRESHOLD - 1,
        },
        info: {
          message: "Violation data retrieved successfully",
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
