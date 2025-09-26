import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, phone, company, role, message } = body;

    // 1. Connect DB
    await connectToDatabase();

    // 2. Check if this email already has a non-rejected request
    const existing = await DemoRequest.findOne({
      email,
      status: { $ne: "rejected" }, // allow resubmission only if last one was rejected
    });

    if (existing) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "A demo request already exists for this email. Please wait for approval or rejection before submitting again.",
        }),
        { status: 400 }
      );
    }

    // 3. Save request in DB
    const demoRequest = new DemoRequest({
      firstname,
      lastname,
      email,
      phone,
      company,
      role,
      message,
      status: "pending", // ensure default status
    });
    await demoRequest.save();

    // 4. Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 5. Email to Super Admin
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

    // 6. Auto-response to user
    const userMailOptions = {
      from: `"Cosmosis Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "✅ We Received Your Demo Request",
      html: `<p>Thank you, ${firstname}! We received your request and our team will review it shortly.</p>`,
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return new Response(
      JSON.stringify({ success: true, message: "Request submitted successfully." }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error handling demo request:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
