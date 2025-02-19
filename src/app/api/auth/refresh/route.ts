import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { UnauthorizedResponse, handleErrors } from "~/lib/error";
import { signToken } from "~/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({ request, isVerified: true });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const token = await signToken({
      id: decodedUser.id,
      email: decodedUser.email,
      role: decodedUser.role,
      isVerified: decodedUser.isVerified,
      updatedAt: decodedUser.updatedAt,
    });

    // @ts-ignore
    decodedUser.password = undefined;

    return NextResponse.json(
      {
        data: {
          token,
          user: decodedUser,
        },
        info: {
          message: "Token Refreshed Successfully!",
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
