import nodemailer from "nodemailer";

import { env } from "~/lib/env";

const nodemailerTransporter = nodemailer.createTransport({
  host: env.NODEMAILER_HOST,
  port: env.NODEMAILER_PORT,
  secure: env.NODEMAILER_SECURE,
  auth: {
    user: env.NODEMAILER_EMAIL,
    pass: env.NODEMAILER_PASSWORD,
  },
});

async function sendOTP({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  nodemailerTransporter.sendMail(
    {
      from: {
        name: env.APP_NAME,
        address: env.APP_SUPPORT_EMAIL,
      },
      to,
      subject: "Verify Your Email",
      text: `Your OTP Code is: ${code}`,
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
}

export { sendOTP };
