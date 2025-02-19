import type { NextRequest } from "next/server";

import { OtpType } from "@prisma/client";
import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { signToken } from "~/lib/jwt";
import { prisma } from "~/lib/prisma";
import { verifyOtpSchema } from "~/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({ request, isVerified: true });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const { otp, type } = verifyOtpSchema.parse(body);

    const existingOtp = await prisma.otp.findUnique({
      where: {
        userId: decodedUser.id,
        type,
      },
    });

    if (!existingOtp) {
      throw new BadResponse("Invalid OTP!");
    }

    if (existingOtp.code !== otp) {
      throw new BadResponse("Invalid OTP!");
    }

    if (type === OtpType.VERIFY_EMAIL) {
      await prisma.user.update({
        where: { id: decodedUser.id },
        data: { isVerified: true },
      });
    }

    await prisma.otp.delete({
      where: {
        userId: decodedUser.id,
        type,
      },
    });

    const token = await signToken({
      id: decodedUser.id,
      email: decodedUser.email,
      role: decodedUser.role,
      isVerified: true,
      updatedAt: decodedUser.updatedAt,
    });

    return NextResponse.json(
      {
        data: { token },
      },
      {
        status: 200,
        statusText: "OTP Verified Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ error });
  }
}
