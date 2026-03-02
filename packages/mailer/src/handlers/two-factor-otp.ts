import { sendMail } from "../index";
import { getEmailTemplate } from "../template";

export const send2FAOTPEmail = async (
  email: string,
  otp: string,
): Promise<void> => {
  const subject = "Your 2FA Verification Code — RicHei Group";
  const text = `Your two-factor authentication code is: ${otp}. This code expires in 10 minutes. If you didn't request this code, please secure your account immediately.`;
  const html = getEmailTemplate(
    "Two-Factor Authentication",
    `
      <p>Use the code below to complete your sign-in:</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 8px 0; color: #718096; font-size: 14px;">Your verification code</p>
        <h2 style="margin: 0; color: #1A3C34; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${otp}</h2>
      </div>
      <p style="color: #718096; font-size: 14px;">This code expires in <strong style="color: #1A3C34;">10 minutes</strong>.</p>
      <p style="color: #718096; font-size: 14px;">If you didn&apos;t request this code, please secure your account by changing your password immediately.</p>
    `,
  );

  await sendMail({ to: email, subject, text, html });
};
