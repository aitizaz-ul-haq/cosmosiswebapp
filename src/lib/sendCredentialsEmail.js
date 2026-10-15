import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import { buildClientRegistrationEmail } from "@/lib/emails/clientRegistrationEmail";

export async function sendCredentialsEmail({ to, ...details }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const { html, text } = buildClientRegistrationEmail(details);

  // Inline attachment works even when the app URL isn't publicly reachable (e.g. localhost)
  const attachments = [];
  let logoHtml = html;
  try {
    const logoPath = path.join(process.cwd(), "public", "images", "cosmosis_logo_dark_dashboard.png");
    const content = await fs.readFile(logoPath);
    attachments.push({ filename: "cosmosis-logo.png", content, cid: "cosmosis-logo" });
    logoHtml = buildClientRegistrationEmail({ ...details, logoSrc: "cid:cosmosis-logo" }).html;
  } catch (logoErr) {
    console.error("Email logo embed failed, using URL:", logoErr.message);
  }

  await transporter.sendMail({
    from: `"Cosmosis Team" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your ${details.companyName || "Cosmosis"} client account has been registered`,
    html: logoHtml,
    text,
    attachments,
  });
}
