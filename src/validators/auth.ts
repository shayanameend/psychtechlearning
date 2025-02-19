import { OtpType, Role } from "@prisma/client";
import { default as zod } from "zod";

const signUpSchema = zod.object({
  email: zod
    .string({
      message: "Invalid Email",
    })
    .email({
      message: "Invalid Email",
    }),
  password: zod
    .string({
      message: "Invalid Password",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(32, {
      message: "Password must be at most 32 characters long",
    }),
  role: zod
    .enum([Role.ADMIN, Role.USER], {
      message: "Role must be either 'ADMIN' or 'USER'",
    })
    .optional(),
});

const signInSchema = zod.object({
  email: zod
    .string({
      message: "Invalid Email",
    })
    .email({
      message: "Invalid Email",
    }),
  password: zod
    .string({
      message: "Invalid Password",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(32, {
      message: "Password must be at most 32 characters long",
    }),
  role: zod
    .enum([Role.ADMIN, Role.USER], {
      message: "Role must be either 'ADMIN' or 'USER'",
    })
    .optional(),
});

const resetPasswordSchema = zod.object({
  email: zod
    .string({
      message: "Invalid Email",
    })
    .email({
      message: "Invalid Email",
    }),
  role: zod
    .enum([Role.ADMIN, Role.USER], {
      message: "Role must be either 'ADMIN' or 'USER'",
    })
    .optional(),
});

const verifyOtpSchema = zod.object({
  otp: zod
    .string({
      message: "Invalid OTP",
    })
    .length(6, {
      message: "OTP must be 6 characters long",
    }),
  type: zod
    .enum([OtpType.VERIFY_EMAIL, OtpType.RESET_PASSWORD], {
      message: "Invalid Type",
    })
    .default(OtpType.VERIFY_EMAIL),
});

const updatePasswordSchema = zod.object({
  password: zod
    .string({
      message: "Invalid Password",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(32, {
      message: "Password must be at most 32 characters long",
    }),
});

export {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  updatePasswordSchema,
};
