import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, phone, company, role, message } = body;

    console.log("📩 Incoming request body:", body);
    console.log("🔑 ENV SMTP_USER:", process.env.SMTP_USER);
    console.log("🔑 ENV SMTP_PASS:", process.env.SMTP_PASS ? "DEFINED" : "MISSING");
    console.log("🔑 ENV SUPERADMIN_EMAIL:", process.env.SUPERADMIN_EMAIL);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminMailOptions = {
      from: `"Cosmosis Demo Request" <${process.env.SMTP_USER}>`,
      to: process.env.SUPERADMIN_EMAIL,
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

    const userMailOptions = {
      from: `"Cosmosis Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "✅ We Received Your Demo Request",
      html: `<p>Thank you, ${firstname}! We received your request.</p>`,
    };

    const infoAdmin = await transporter.sendMail(adminMailOptions);
    console.log("✅ Admin mail sent:", infoAdmin.response);

    const infoUser = await transporter.sendMail(userMailOptions);
    console.log("✅ User mail sent:", infoUser.response);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("❌ Error in request-demo:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
