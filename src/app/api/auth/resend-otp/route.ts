import type { NextRequest } from "next/server";

import { OtpType } from "@prisma/client";
import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { UnauthorizedResponse, handleErrors } from "~/lib/error";
import { sendOTP } from "~/lib/nodemailer";
import { prisma } from "~/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({ request, isVerified: false });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";

    for (let i = 0; i < 6; i++) {
      code += sampleSpace[Math.floor(Math.random() * sampleSpace.length)];
    }

    const otp = await prisma.otp.upsert({
      where: {
        userId: decodedUser.id,
      },
      update: {
        code,
        type: OtpType.VERIFY_EMAIL,
      },
      create: {
        code,
        type: OtpType.VERIFY_EMAIL,
        user: {
          connect: {
            id: decodedUser.id,
          },
        },
      },
    });

    await sendOTP({
      to: decodedUser.email,
      code: otp.code,
    });

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "OTP Sent Successfully!",
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
