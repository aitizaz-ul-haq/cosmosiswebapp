import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import ClientProfile from "@/models/ClientProfile";

const ALLOWED_ONBOARDING_TYPES = new Set(["individual", "joint", "corporate", "trust"]);
const MIN_PASSWORD_LENGTH = 8;

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);

// Resolves the profile and checks the RM may act on it; returns { profile } or { error }.
async function loadRegistryProfile(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (tokenUser.role !== "rm") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id || !mongoose.isValidObjectId(id)) {
    return { error: NextResponse.json({ error: "Invalid id" }, { status: 400 }) };
  }

  await connectToDatabase();

  let profile = await ClientProfile.findById(id);
  if (!profile) {
    profile = await ClientProfile.findOne({ userId: id });
  }
  if (!profile) {
    return { error: NextResponse.json({ error: "Client not found" }, { status: 404 }) };
  }

  const rmId = String(tokenUser.id);
  const hasAccess =
    String(profile.companyId) === String(tokenUser.companyId) &&
    (String(profile.assignedToUserId) === rmId ||
      (profile.sharedWithUserIds || []).some((u) => String(u) === rmId));
  if (!hasAccess) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  if (profile.status !== "register") {
    return {
      error: NextResponse.json(
        { error: "Client is not awaiting registration" },
        { status: 409 }
      ),
    };
  }

  return { profile, tokenUser };
}

async function sendCredentialsEmail({ to, fullName, username, password, loginUrl, companyName }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Cosmosis Team" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Cosmosis account has been created",
    html: `
      <h2>Hello ${escapeHtml(fullName || "")},</h2>
      <p>Your account${companyName ? ` with <b>${escapeHtml(companyName)}</b>` : ""} has been approved and registered.</p>
      <p>You can log in with the following credentials:</p>
      <ul>
        <li><b>Username:</b> ${escapeHtml(username)}</li>
        <li><b>Password:</b> ${escapeHtml(password)}</li>
      </ul>
      <p><a href="${escapeHtml(loginUrl)}">Log in to Cosmosis</a></p>
      <p>Please change your password after logging in.</p>
      <p>— Cosmosis Team</p>
    `,
  });
}

// Register: set username/password on an approved client and email the credentials.
export async function POST(req) {
  try {
    const { profile, error } = await loadRegistryProfile(req);
    if (error) return error;

    const body = await req.json().catch(() => ({}));
    const username = normalizeString(body.username).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || /\s/.test(username)) {
      return NextResponse.json(
        { error: "A username without spaces is required" },
        { status: 400 }
      );
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    const clientUser = await User.findById(profile.userId);
    if (!clientUser) {
      return NextResponse.json({ error: "Client user not found" }, { status: 404 });
    }
    if (!clientUser.email) {
      return NextResponse.json({ error: "Client has no email address" }, { status: 400 });
    }

    const taken = await User.findOne({ username, _id: { $ne: clientUser._id } }).select("_id");
    if (taken) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }

    clientUser.username = username;
    clientUser.passwordHash = await bcrypt.hash(password, 10);
    clientUser.isActive = true;
    await clientUser.save();

    profile.status = "ongoing";
    profile.registeredAt = new Date();
    await profile.save();

    let emailSent = true;
    try {
      await sendCredentialsEmail({
        to: clientUser.email,
        fullName: clientUser.fullName,
        username,
        password,
        loginUrl: `${new URL(req.url).origin}/login`,
        companyName: profile.companyName,
      });
    } catch (mailErr) {
      emailSent = false;
      console.error("Registration email error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      emailSent,
      client: { userId: clientUser._id, profileId: profile._id, username, status: "ongoing" },
    });
  } catch (err) {
    console.error("Register client error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Edit: update the basic details of an approved client before registration.
export async function PATCH(req) {
  try {
    const { profile, error } = await loadRegistryProfile(req);
    if (error) return error;

    const body = await req.json().catch(() => ({}));
    const fullName = normalizeString(body.fullName);
    const email = normalizeString(body.email).toLowerCase();
    const phone = normalizeString(body.phone);
    const rmRemarks = normalizeString(body.rmRemarks);

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Full name, email and phone are required" },
        { status: 400 }
      );
    }

    profile.rmRemarks = rmRemarks;
    if (ALLOWED_ONBOARDING_TYPES.has(body.onboardingType)) {
      profile.onboardingType = body.onboardingType;
    }
    const emailTaken = await User.exists({ email, _id: { $ne: profile.userId } });
    if (emailTaken) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }
    await profile.save();
    await User.findByIdAndUpdate(profile.userId, { fullName, email, phone });

    return NextResponse.json({
      success: true,
      client: {
        userId: profile.userId,
        profileId: profile._id,
        fullName,
        email,
        phone,
        rmRemarks,
        onboardingType: profile.onboardingType,
      },
    });
  } catch (err) {
    console.error("Edit registry client error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
