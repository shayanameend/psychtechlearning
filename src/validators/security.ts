import { ViolationType } from "@prisma/client";
import { default as zod } from "zod";

export const createSecurityViolationSchema = zod.object({
  type: zod.nativeEnum(ViolationType),
  description: zod
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
});

export const unblockUserSchema = zod.object({
  userId: zod.string().min(1, "User ID is required"),
});
