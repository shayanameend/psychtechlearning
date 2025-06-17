import type { NextRequest } from "next/server";

import { OtpType } from "@prisma/client";
import { default as argon } from "argon2";
import { NextResponse } from "next/server";

import { BadResponse, NotFoundResponse, handleErrors } from "~/lib/error";
import { signToken } from "~/lib/jwt";
import { sendOTP } from "~/lib/nodemailer";
import { prisma } from "~/lib/prisma";
import { signInSchema } from "~/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    body.email = body.email.toLowerCase();

    const { email, password, role } = signInSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email, role },
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

    const isPasswordValid = await argon.verify(user.password, password);

    if (!isPasswordValid) {
      throw new BadResponse("Invalid Password!");
    }

    // Check if user is blocked
    if (user.isBlocked) {
      throw new BadResponse(
        "Your account has been blocked due to security violations. Please contact support for assistance.",
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      updatedAt: user.updatedAt,
    });

    if (!user.isVerified) {
      const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let code = "";

      for (let i = 0; i < 6; i++) {
        code += sampleSpace[Math.floor(Math.random() * sampleSpace.length)];
      }

      const otp = await prisma.otp.upsert({
        where: {
          userId: user.id,
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
              id: user.id,
            },
          },
        },
      });

      await sendOTP({
        to: user.email,
        code: otp.code,
      });

      return NextResponse.json(
        {
          data: { token },
          info: {
            message: "OTP Sent Successfully!",
          },
        },
        {
          status: 200,
        },
      );
    }

    // @ts-ignore
    user.password = undefined;

    return NextResponse.json(
      {
        data: { token, user },
        info: {
          message: "Sign In Successful!",
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
