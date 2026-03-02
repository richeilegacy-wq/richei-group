export const getEmailTemplate = (
  title: string,
  content: string,
  buttonText?: string,
  buttonUrl?: string
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #333333;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: left;">
              <h1 style="margin: 0; color: #1A3C34; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">RicHei <span style="display: block; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-top: -4px;">Group</span></h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1A3C34; font-size: 22px; font-weight: 700;">${title}</h2>
              <div style="color: #4a5568; font-size: 16px; line-height: 1.7;">
                ${content}
              </div>
            </td>
          </tr>
          
          <!-- CTA Button -->
          ${
            buttonText && buttonUrl
              ? `
          <tr>
            <td align="left" style="padding: 0 40px 40px 40px;">
              <a href="${buttonUrl}" style="display: inline-block; padding: 14px 32px; background-color: #1A3C34; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">${buttonText}</a>
            </td>
          </tr>
        `
              : ""
          }
          
          <!-- Footer -->
          <tr>
            <td style="padding: 40px; background-color: #fafafa; border-top: 1px solid #edf2f7; text-align: center;">
              <p style="margin: 0; color: #718096; font-size: 14px; font-weight: 500;">
                &copy; ${new Date().getFullYear()} RicHei Group. All rights reserved.
              </p>
              <div style="margin-top: 15px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                  You are receiving this email because you registered on RicHei Group.<br>
                  If you didn't request this email, you can safely ignore it.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
