import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";
import User from "@/models/User";
import { generatePassword } from "@/utils/generatePassword";

// ✅ GET all demo requests
export async function GET() {
  try {
    await connectToDatabase();
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    return NextResponse.json(requests, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching demo requests:", err);
    return NextResponse.json({ error: "Failed to fetch demo requests" }, { status: 500 });
  }
}

// ✅ POST new demo request
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // prevent duplicate email submissions
    const exists = await DemoRequest.findOne({ email: body.email });
    if (exists) {
      return NextResponse.json({ error: "You have already submitted a demo request." }, { status: 400 });
    }

    const request = await DemoRequest.create(body);
    return NextResponse.json(request, { status: 201 });
  } catch (err) {
    console.error("❌ Error creating demo request:", err);
    return NextResponse.json({ error: "Failed to create demo request" }, { status: 500 });
  }
}

// ✅ PATCH (Approve / Reject)
export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { id, status } = await req.json();

    if (!id || !status)
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });

    // Find the demo request
    const demoReq = await DemoRequest.findById(id);
    if (!demoReq)
      return NextResponse.json({ error: "Demo request not found" }, { status: 404 });

    demoReq.status = status;
    await demoReq.save();

    // ⚙️ Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 📩 APPROVED FLOW
    if (status === "approved") {
      // 1️⃣ Generate credentials
      const plainPassword = passwordGenerator();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // 2️⃣ Create a demo user (if not already created)
      const existingUser = await User.findOne({ email: demoReq.email });
      if (!existingUser) {
        await User.create({
          username: demoReq.email,
          email: demoReq.email,
          password: hashedPassword,
          role: "demoUser",
          subscriptionStatus: "demo",
        });
      }

      // 3️⃣ Send approval + credentials email
      await transporter.sendMail({
        from: `"Cosmosis" <${process.env.SMTP_USER}>`,
        to: demoReq.email,
        subject: "Your Cosmosis Demo Access",
        html: `
          <h3>Demo Access Approved</h3>
          <p>Dear ${demoReq.name || "User"},</p>
          <p>Your demo request has been approved. You can now log in using the credentials below:</p>
          <ul>
            <li><b>Username:</b> ${demoReq.email}</li>
            <li><b>Password:</b> ${plainPassword}</li>
          </ul>
          <p>Please <a href="${process.env.NEXT_PUBLIC_BASE_URL}/change-password">change your password</a> after logging in.</p>
          <p>Welcome aboard!</p>
        `,
      });

      return NextResponse.json(
        { success: true, message: "Demo approved, user created, and email sent." },
        { status: 200 }
      );
    }

    // 📩 REJECTED FLOW
    if (status === "rejected") {
      await transporter.sendMail({
        from: `"Cosmosis" <${process.env.SMTP_USER}>`,
        to: demoReq.email,
        subject: "Your Cosmosis Demo Request Update",
        html: `
          <h3>Demo Request Rejected</h3>
          <p>Dear ${demoReq.name || "User"},</p>
          <p>We appreciate your interest in Cosmosis, but your demo request was not approved at this time.</p>
          <p>If you believe this is a mistake, please contact our support team.</p>
        `,
      });

      return NextResponse.json(
        { success: true, message: "Demo rejected and email sent." },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, message: "Status updated." }, { status: 200 });
  } catch (err) {
    console.error("❌ Error updating demo request:", err);
    return NextResponse.json({ error: "Failed to update demo request" }, { status: 500 });
  }
}


// ✅ Delete a demo request
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const deleted = await DemoRequest.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Request deleted" }, { status: 200 });
  } catch (err) {
    console.error("❌ Error deleting demo request:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

