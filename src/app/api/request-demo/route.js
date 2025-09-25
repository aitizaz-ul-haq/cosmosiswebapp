import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    const { firstname, lastname, email, phone, company, role, message } = body;

    // ✅ Gmail app password transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Email to Super Admin
    const adminMailOptions = {
      from: `"Cosmosis Demo Request" <${process.env.SMTP_USER}>`,
      to: process.env.SUPERADMIN_EMAIL, // super admin inbox
      subject: "🚀 New Demo Request - Cosmosis",
      html: `
        <h2>New Demo Request</h2>
        <p><b>Name:</b> ${firstname} ${lastname}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Company:</b> ${company || "N/A"}</p>
        <p><b>Role:</b> ${role}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    };

    // ✅ Auto-response to user
    const userMailOptions = {
      from: `"Cosmosis Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "✅ We Received Your Demo Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#21CFB2">Thank you, ${firstname}!</h2>
          <p>
            We’ve received your demo request for Cosmosis.  
            Our Super Admin has been notified and will review your request shortly.
          </p>
          <p>
            You’ll hear from us soon. In the meantime, feel free to reply to this email if you have any questions.
          </p>
          <p style="margin-top:30px; font-size:12px; color:#666;">
            — The Cosmosis Team
          </p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send email." }),
      { status: 500 }
    );
  }
}
