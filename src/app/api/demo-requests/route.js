import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import DemoRequest from "@/models/DemoRequest";
import nodemailer from "nodemailer";

// ✅ GET all demo requests (Super Admin only)
export async function GET() {
  try {
    await connectToDatabase();
    const requests = await DemoRequest.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify({ success: true, data: requests }), {
      status: 200,
    });
  } catch (err) {
    console.error("❌ Error fetching demo requests:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}

// ✅ Update request status
export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { id, status } = await req.json();

    const demoReq = await DemoRequest.findById(id);
    if (!demoReq) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Update status
    demoReq.status = status;
    await demoReq.save();

    if (status === "approved") {
      // 1️⃣ Create company
      const company = await Company.create({
        name: demoReq.company || `${demoReq.firstname} Company`,
        createdAt: new Date(),
      });

      // 2️⃣ Generate password + hash
      const plainPassword = generatePassword(14);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // 3️⃣ Create supervisor
      const supervisor = await User.create({
        username: demoReq.email,
        password: hashedPassword,
        role: "supervisor",
        companyId: company._id,
        firstname: demoReq.firstname,
        lastname: demoReq.lastname,
        email: demoReq.email,
      });

      // 4️⃣ Send email with credentials
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Cosmosis Team" <${process.env.SMTP_USER}>`,
        to: demoReq.email,
        subject: "✅ Demo Request Approved - Your Supervisor Account",
        html: `
          <h2>Hello ${demoReq.firstname},</h2>
          <p>Your demo request has been <b>approved</b>.</p>
          <p>You can now log in with the following credentials:</p>
          <ul>
            <li><b>Username:</b> ${demoReq.email}</li>
            <li><b>Password:</b> ${plainPassword}</li>
          </ul>
          <p>Please change your password after logging in.</p>
          <p>— Cosmosis Team</p>
        `,
      });
    }

    if (status === "rejected") {
      // Send rejection email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Cosmosis Team" <${process.env.SMTP_USER}>`,
        to: demoReq.email,
        subject: "❌ Demo Request Rejected",
        html: `
          <h2>Hello ${demoReq.firstname},</h2>
          <p>Unfortunately, your demo request has been <b>rejected</b>.</p>
          <p>If you believe this is a mistake, feel free to contact us.</p>
          <p>— Cosmosis Team</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error in PATCH /demo-requests:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Delete a demo request
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "ID is required" }),
        { status: 400 }
      );
    }

    const deleted = await DemoRequest.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ success: false, error: "Request not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Request deleted" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error deleting demo request:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
