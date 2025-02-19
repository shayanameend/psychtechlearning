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
      },
      {
        status: 201,
        statusText: "Sign Up Successful!",
      },
    );
  } catch (error) {
    return handleErrors({ error });
  }
}
