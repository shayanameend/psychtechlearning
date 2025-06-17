import type { NextRequest } from "next/server";

import { OtpType } from "@prisma/client";
import { default as argon } from "argon2";
import { NextResponse } from "next/server";

import { BadResponse, handleErrors } from "~/lib/error";
import { signToken } from "~/lib/jwt";
import { sendOTP } from "~/lib/nodemailer";
import { prisma } from "~/lib/prisma";
import { signUpSchema } from "~/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    body.email = body.email.toLowerCase();

    const { email, password, role } = signUpSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
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

    if (existingUser) {
      throw new BadResponse("User Already Exists!");
    }

    const hashedPassword = await argon.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
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

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      updatedAt: user.updatedAt,
    });

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
          message: "Sign Up Successful!",
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
