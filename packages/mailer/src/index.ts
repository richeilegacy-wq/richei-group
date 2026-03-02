import { env } from "@richei-group/env/server";
import "dotenv/config";
import nodemailer from "nodemailer";

const mailerEmail = env.MAILER_EMAIL;
const mailerPassword = env.MAILER_PASSWORD;

if (!mailerEmail || !mailerPassword) {
  throw new Error("MAILER_EMAIL and MAILER_PASSWORD must be set");
}

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: mailerEmail,
    pass: mailerPassword,
  },
  logger: env.NODE_ENV !== "production",
  debug: env.NODE_ENV !== "production",
});

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendMail = async ({
  to,
  subject,
  text,
  html,
}: MailOptions): Promise<void> => {
  const mailOptions = {
    from: mailerEmail,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    throw new Error("Failed to send email");
  }
};

export { getEmailTemplate } from "./template";

export { sendForgotPasswordEmail } from "./handlers/forgot-password";
export { sendVerificationEmail } from "./handlers/verification";
export { sendWelcomeEmail } from "./handlers/welcome";
export { sendContactEmail } from "./handlers/contact";
export { send2FAOTPEmail } from "./handlers/two-factor-otp";
