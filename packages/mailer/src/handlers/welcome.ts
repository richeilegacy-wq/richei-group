import { sendMail } from "../index";
import { getEmailTemplate } from "../template";

export const sendWelcomeEmail = async (
  email: string,
  name?: string | null,
): Promise<void> => {
  const displayName = name || "there";
  const subject = "Welcome to RicHei Group!";
  const text = `Welcome ${displayName}! Thank you for joining RicHei Group. Start your journey into genuine tokenized real estate today.`;
  const html = getEmailTemplate(
    `Welcome, ${displayName}!`,
    `
      <p>Thank you for joining RicHei Group - your gateway to genuine tokenized real estate investment.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: left;">
        <h2 style="color: #1A3C34; margin: 0 0 12px 0; font-size: 20px; font-weight: bold;">🏠 Your Real Estate Journey Starts Here</h2>
        <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6;">Manage your finances with our app that merges saving, investing, and planning tools to achieve your goals.</p>
      </div>
      
      <p>With RicHei Group, you can:</p>
      <ul style="color: #4a5568; margin: 20px 0; padding-left: 20px; line-height: 1.8;">
        <li style="margin-bottom: 10px;">Invest in prime Nigerian land and residential projects</li>
        <li style="margin-bottom: 10px;">Track your portfolio performance in real-time</li>
        <li style="margin-bottom: 10px;">Access secure documents and digital deeds</li>
        <li style="margin-bottom: 10px;">Gain investment literacy through RicHei Academy</li>
      </ul>
      <p>Ready to get started? Log in to your dashboard to explore available projects.</p>
      <p style="margin-top: 20px; color: #1A3C34; font-weight: bold;">To your success,</p>
      <p style="color: #1A3C34; font-weight: bold;">The RicHei Group Team</p>
    `,
    "Go to Dashboard",
    "https://app.richeigroup.com/dashboard"
  );

  await sendMail({ to: email, subject, text, html });
};
