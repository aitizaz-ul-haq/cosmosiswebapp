import nodemailer from "nodemailer";

async function main() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,  // Gmail address
      pass: process.env.SMTP_PASS,  // Gmail app password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test Cosmosis" <${process.env.SMTP_USER}>`,
      to: process.env.SUPERADMIN_EMAIL,
      subject: "Hello from testMail.js",
      text: "This is a plain text test.",
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
