import type { NextRequest } from "next/server";

import { default as argon } from "argon2";
import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { updatePasswordSchema } from "~/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({ request, isVerified: true });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const { password } = updatePasswordSchema.parse(body);

    const hashedPassword = await argon.hash(password);

    await prisma.user.update({
      where: { id: decodedUser.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        data: {},
      },
      {
        status: 200,
        statusText: "Password Updated Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ error });
  }
}
