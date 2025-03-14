import type { Role } from "@prisma/client";

import jwt from "jsonwebtoken";

import { env } from "~/lib/env";

async function signToken(payload: {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  updatedAt: Date;
}) {
  // @ts-ignore
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRY,
  });
}

async function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}

export { signToken, verifyToken };
