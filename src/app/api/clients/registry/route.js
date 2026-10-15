import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import ClientProfile from "@/models/ClientProfile";
import { sendCredentialsEmail } from "@/lib/sendCredentialsEmail";
import { encryptSecret } from "@/lib/credentialCrypto";
import { parseSchedule } from "@/lib/parseSchedule";

const ALLOWED_ONBOARDING_TYPES = new Set(["individual", "joint", "corporate", "trust"]);
const MIN_PASSWORD_LENGTH = 8;

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

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

// Register now, or (action "schedule") set credentials now and email them at the scheduled time.
export async function POST(req) {
  try {
    const { profile, error } = await loadRegistryProfile(req);
    if (error) return error;

    const body = await req.json().catch(() => ({}));
    const isSchedule = body.action === "schedule";

    let schedule = null;
    if (isSchedule) {
      schedule = parseSchedule(body);
      if (schedule.error) {
        return NextResponse.json({ error: schedule.error }, { status: 400 });
      }
    }

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
    // Scheduled clients stay inactive (cannot log in) until the email is sent
    clientUser.isActive = !isSchedule;
    await clientUser.save();

    if (isSchedule) {
      profile.status = "scheduled";
      profile.scheduledRegistrationAt = schedule.scheduledAt;
      profile.scheduledCountry = schedule.country;
      profile.scheduledCity = schedule.city;
      profile.scheduledTimeZone = schedule.timeZone;
      profile.scheduledCredentialsEnc = encryptSecret(password);
      await profile.save();
      return NextResponse.json({
        success: true,
        client: {
          userId: clientUser._id,
          profileId: profile._id,
          username,
          status: "scheduled",
          scheduledRegistrationAt: schedule.scheduledAt,
          scheduledCountry: schedule.country,
          scheduledCity: schedule.city,
          scheduledTimeZone: schedule.timeZone,
        },
      });
    }

    profile.status = "ongoing";
    profile.registeredAt = new Date();
    profile.scheduledRegistrationAt = null;
    profile.scheduledCountry = "";
    profile.scheduledCity = "";
    profile.scheduledTimeZone = "";
    await profile.save();

    let emailSent = true;
    // Public URL for the login link and logo; set APP_URL in production
    const baseUrl = (process.env.APP_URL || new URL(req.url).origin).replace(/\/+$/, "");
    try {
      const designatedRm = await User.findById(profile.assignedToUserId).select(
        "fullName username email"
      );
      await sendCredentialsEmail({
        to: clientUser.email,
        fullName: clientUser.fullName,
        username,
        password,
        baseUrl,
        loginUrl: `${baseUrl}/login`,
        companyName: profile.companyName,
        rmName: designatedRm?.fullName || designatedRm?.username,
        rmEmail: designatedRm?.email,
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
