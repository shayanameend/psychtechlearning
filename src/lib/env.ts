import { default as zod } from "zod";

const envSchema = zod.object({
  JWT_SECRET: zod.string(),
  JWT_EXPIRY: zod.string(),
  // NODEMAILER_HOST: zod.string(),
  // NODEMAILER_PORT: zod.coerce.number(),
  // NODEMAILER_SECURE: zod.coerce.boolean(),
  // NODEMAILER_EMAIL: zod.string().email(),
  // NODEMAILER_PASSWORD: zod.string(),
  DATABASE_URL: zod.string().url(),
  //   CLIENT_BASE_URL: zod.string().url(),
  //   APP_NAME: zod.string(),
  //   APP_SUPPORT_EMAIL: zod.string().email(),
  //   APP_ADMIN_EMAIL: zod.string().email(),
});

export const env = envSchema.parse(process.env);
