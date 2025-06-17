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
import { createProfileSchema, updateProfileSchema } from "~/validators/profile";

export async function GET(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: decodedUser.id,
      },
      select: {
        user: {
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
        },
      },
    });

    if (!profile) {
      throw new NotFoundResponse("Profile Not Found!");
    }

    return NextResponse.json(
      {
        data: { user: profile?.user },
        info: {
          message: "Profile Fetched Successfully!",
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

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: false,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const { firstName, lastName, isStudent, notify } =
      createProfileSchema.parse(body);

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: decodedUser.id,
      },
    });

    if (existingProfile) {
      throw new BadResponse("Profile Already Exists!");
    }

    const profile = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        isStudent,
        notify,
        user: {
          connect: {
            id: decodedUser.id,
          },
        },
      },
      select: {
        user: {
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
        },
      },
    });

    return NextResponse.json(
      {
        data: { user: profile.user },
        info: {
          message: "Profile Created Successfully!",
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

export async function PUT(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const { firstName, lastName, isStudent, notify } =
      updateProfileSchema.parse(body);

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: decodedUser.id,
      },
    });

    if (!existingProfile) {
      throw new NotFoundResponse("Profile Not Found!");
    }

    const profile = await prisma.profile.update({
      where: {
        userId: decodedUser.id,
      },
      data: {
        firstName,
        lastName,
        isStudent,
        notify,
      },
      select: {
        user: {
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
        },
      },
    });

    return NextResponse.json(
      {
        data: { user: profile.user },
        info: {
          message: "Profile Updated Successfully!",
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
