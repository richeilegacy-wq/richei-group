import { sendMail } from "../index";
import { getEmailTemplate } from "../template";

export const sendVerificationEmail = async (
  email: string,
  verificationUrl: string,
): Promise<void> => {
  const subject = "Verify Your Email — RicHei Group";
  const text = `Please verify your email address by clicking the following link: ${verificationUrl}`;
  const html = getEmailTemplate(
    "Verify Your Email",
    `
      <p>Thanks for signing up! Please verify your email address to activate your account and start your real estate investment journey with RicHei Group.</p>
      <p style="color: #718096; margin-top: 16px; font-size: 14px;">This verification link will expire in 24 hours.</p>
    `,
    "Verify Email",
    verificationUrl,
  );

  await sendMail({ to: email, subject, text, html });
};
