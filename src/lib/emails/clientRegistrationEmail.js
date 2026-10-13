// Palette and type scale taken from the app (globals.css / layout.js).
const C = {
  teal: "#21CFB2",
  tealTint: "#E6FAF6",
  slate: "#6D7692",
  ink: "#1A1A1A",
  body: "#374151",
  muted: "#9AA0B2",
  line: "#EEF0F5",
  page: "#FDFBF9",
  white: "#FFFFFF",
};
const FONT = "'Poppins', Arial, Helvetica, sans-serif";

const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);

const label = (text) =>
  `<div style="font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${C.slate};">${esc(text)}</div>`;

export function buildClientRegistrationEmail({
  fullName,
  username,
  password,
  loginUrl,
  baseUrl,
  logoSrc,
  companyName,
  rmName,
  rmEmail,
}) {
  const company = companyName || "your company";
  // Same dark logo the dashboard uses on light backgrounds
  const logoUrl = logoSrc || `${baseUrl}/images/cosmosis_logo_dark_dashboard.png`;
  const p = `margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.7;font-weight:400;color:${C.body};`;

  const credRow = (name, value, withTopBorder) => `
    <tr>
      <td style="padding:14px 0;${withTopBorder ? `border-top:1px solid ${C.line};` : ""}font-family:${FONT};font-size:14px;color:${C.slate};width:38%;vertical-align:top;">${name}</td>
      <td style="padding:14px 0;${withTopBorder ? `border-top:1px solid ${C.line};` : ""}font-family:${FONT};font-size:16px;font-weight:600;color:${C.ink};vertical-align:top;word-break:break-all;">${esc(value)}</td>
    </tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to Cosmosis</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${C.page};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.white};border:1px solid ${C.line};border-radius:12px;overflow:hidden;">
        <tr><td style="height:6px;background:${C.teal};font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Header -->
        <tr><td style="padding:24px 32px;border-bottom:1px solid ${C.line};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="middle">
              <img src="${esc(logoUrl)}" alt="Cosmosis" width="120" style="display:block;border:0;height:auto;width:120px;">
            </td>
            <td valign="top" align="right">
              <div style="font-family:${FONT};font-size:14px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${C.ink};">${esc(company)}</div>
              <div style="font-family:${FONT};font-size:12px;color:${C.slate};">Client Services</div>
            </td>
          </tr></table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <div style="display:inline-block;padding:6px 14px;border:1px solid ${C.teal};background:${C.tealTint};border-radius:4px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${C.ink};">&#10003; Account Registered</div>

          <h1 style="margin:20px 0 20px;font-family:${FONT};font-size:35px;line-height:1.2;font-weight:500;color:${C.ink};">Welcome to Cosmosis</h1>

          <p style="${p}">Dear ${esc(fullName || "")},</p>
          <p style="${p}">We are pleased to inform you that your client account with <strong style="font-weight:600;color:${C.ink};">${esc(company)}</strong> has been successfully registered by your designated Relationship Manager (RM).</p>
          <p style="${p}">As part of our client onboarding process, you are invited to complete your onboarding through <strong style="font-weight:600;color:${C.ink};">Cosmosis</strong>, our secure digital client onboarding platform designed to provide a streamlined, efficient and convenient experience.</p>

          <!-- Credentials -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:${C.page};border:1px solid ${C.line};border-radius:10px;">
            <tr><td style="padding:20px 24px;">
              ${label("Secure Access")}
              <div style="margin:4px 0 12px;font-family:${FONT};font-size:22px;font-weight:500;color:${C.ink};">Your Login Credentials</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${credRow("Username", username, true)}
                ${credRow("Temporary password", password, true)}
              </table>
            </td></tr>
          </table>

          <!-- Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
            <a href="${esc(loginUrl)}" style="display:inline-block;padding:14px 40px;background:${C.teal};border-radius:8px;font-family:${FONT};font-size:16px;font-weight:600;color:${C.white};text-decoration:none;">Access Cosmosis &rarr;</a>
            <div style="margin-top:10px;font-family:${FONT};font-size:12px;color:${C.muted};">Select the button above to open the secure login portal.</div>
          </td></tr></table>

          <!-- Security note -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:${C.tealTint};border-left:4px solid ${C.teal};">
            <tr><td style="padding:14px 18px;font-family:${FONT};font-size:14px;line-height:1.7;color:${C.body};">
              <strong style="font-weight:600;color:${C.ink};">Important security step:</strong> Please change your temporary password immediately after your first login to help protect your account.
            </td></tr>
          </table>

          <!-- RM -->
          <h2 style="margin:28px 0 12px;font-family:${FONT};font-size:22px;font-weight:500;color:${C.ink};">Your Relationship Manager</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid ${C.line};border-radius:10px;">
            <tr><td style="padding:18px 22px;">
              ${label("Name")}
              <div style="margin:2px 0 14px;font-family:${FONT};font-size:16px;font-weight:600;color:${C.ink};">${esc(rmName || "")}</div>
              ${label("Email")}
              <div style="margin-top:2px;font-family:${FONT};font-size:16px;font-weight:600;">${
                rmEmail
                  ? `<a href="mailto:${esc(rmEmail)}" style="color:${C.slate};text-decoration:underline;">${esc(rmEmail)}</a>`
                  : ""
              }</div>
            </td></tr>
          </table>

          <p style="${p}">Should you experience any difficulties accessing your account or require assistance during the onboarding process, please contact your designated Relationship Manager using the email address provided above.</p>
          <p style="${p}">We look forward to providing you with a smooth and efficient onboarding experience through Cosmosis.</p>

          <p style="margin:28px 0 0;font-family:${FONT};font-size:16px;line-height:1.7;color:${C.body};">Kind regards,<br>
            <strong style="font-weight:600;color:${C.ink};">Cosmosis Team</strong><br>
            <em style="font-size:14px;color:${C.slate};">On behalf of ${esc(company)}</em>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding:24px 32px;border-top:1px solid ${C.line};">
          <div style="font-family:${FONT};font-size:12px;line-height:1.7;color:${C.muted};">This is an automated, system-generated email. Please do not reply directly to this message.</div>
          <div style="margin-top:10px;font-family:${FONT};font-size:12px;color:${C.muted};">Sent securely through <strong style="font-weight:600;color:${C.slate};">COSMOSIS</strong> &bull; Client Onboarding Platform</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    "Welcome to Cosmosis",
    "",
    `Dear ${fullName || ""},`,
    "",
    `We are pleased to inform you that your client account with ${company} has been successfully registered by your designated Relationship Manager (RM).`,
    "",
    "As part of our client onboarding process, you are invited to complete your onboarding through Cosmosis, our secure digital client onboarding platform designed to provide a streamlined, efficient and convenient experience.",
    "",
    "Your Login Credentials",
    `- Username: ${username}`,
    `- Temporary password: ${password}`,
    `- Login portal: ${loginUrl}`,
    "",
    "Important security step: Please change your temporary password immediately after your first login to help protect your account.",
    "",
    "Your Relationship Manager",
    `- Name: ${rmName || ""}`,
    `- Email: ${rmEmail || ""}`,
    "",
    "Should you experience any difficulties accessing your account or require assistance during the onboarding process, please contact your designated Relationship Manager using the email address provided above.",
    "",
    "We look forward to providing you with a smooth and efficient onboarding experience through Cosmosis.",
    "",
    "Kind regards,",
    "Cosmosis Team",
    `On behalf of ${company}`,
    "",
    "This is an automated, system-generated email. Please do not reply directly to this message.",
  ].join("\n");

  return { html, text };
}
