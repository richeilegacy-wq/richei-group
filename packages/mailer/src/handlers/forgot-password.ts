import { sendMail } from "../index";
import { getEmailTemplate } from "../template";

export const sendForgotPasswordEmail = async (
  email: string,
  resetUrl: string,
): Promise<void> => {
  const subject = "Reset Your Password — RicHei Group";
  const text = `You requested a password reset. Click the link to reset your password: ${resetUrl}. If you didn't request this, you can safely ignore this email.`;
  const html = getEmailTemplate(
    "Reset Your Password",
    `
      <p>We received a request to reset your password. Click the button below to create a new password.</p>
      <p style="color: #718096; margin-top: 16px; font-size: 14px;">This link will expire in 15 minutes for security purposes.</p>
      <p style="color: #718096; font-size: 14px;">If you didn&apos;t request a password reset, no action is needed — your account is still secure.</p>
    `,
    "Reset Password",
    resetUrl,
  );

  await sendMail({ to: email, subject, text, html });
};
