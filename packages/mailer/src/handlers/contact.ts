import { sendMail } from "../index";
import { getEmailTemplate } from "../template";

interface ContactEmailOptions {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export const sendContactEmail = async ({
  name,
  email,
  message,
  subject,
}: ContactEmailOptions): Promise<void> => {
  const emailSubject = subject || `New Contact Form Submission from ${name}`;
  const text = `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
  const html = getEmailTemplate(
    "New Contact Form Submission",
    `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 16px 0;">
        <p style="margin: 0 0 12px 0;"><strong style="color: #1A3C34;">Name:</strong> ${name}</p>
        <p style="margin: 0 0 12px 0;"><strong style="color: #1A3C34;">Email:</strong> ${email}</p>
        <p style="margin: 0;"><strong style="color: #1A3C34;">Message:</strong></p>
        <p style="margin: 8px 0 0 0; color: #4a5568; white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>
    `,
  );

  await sendMail({ to: email, subject: emailSubject, text, html });
};
