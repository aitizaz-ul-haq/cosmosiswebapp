import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import ClientProfile from "@/models/ClientProfile";
import { decryptSecret } from "@/lib/credentialCrypto";
import { parseSchedule } from "@/lib/parseSchedule";

// Loads a scheduled profile the calling RM owns or is shared on.
async function loadScheduledProfile(req) {
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
  let profile = await ClientProfile.findById(id).select("+scheduledCredentialsEnc");
  if (!profile) {
    profile = await ClientProfile.findOne({ userId: id }).select("+scheduledCredentialsEnc");
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
  if (profile.status !== "scheduled") {
    return {
      error: NextResponse.json({ error: "Onboarding is not scheduled" }, { status: 409 }),
    };
  }
  return { profile };
}

// Credentials and schedule for the details modal.
export async function GET(req) {
  try {
    const { profile, error } = await loadScheduledProfile(req);
    if (error) return error;

    const clientUser = await User.findById(profile.userId).select("username");
    let password = "";
    try {
      password = decryptSecret(profile.scheduledCredentialsEnc);
    } catch (err) {
      console.error("Decrypt scheduled credentials failed:", err);
    }
    return NextResponse.json({
      success: true,
      username: clientUser?.username || "",
      password,
      scheduledRegistrationAt: profile.scheduledRegistrationAt,
      scheduledCountry: profile.scheduledCountry,
      scheduledCity: profile.scheduledCity,
      scheduledTimeZone: profile.scheduledTimeZone,
    });
  } catch (err) {
    console.error("Get scheduled onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Change the scheduled date, time and location.
export async function PATCH(req) {
  try {
    const { profile, error } = await loadScheduledProfile(req);
    if (error) return error;

    const body = await req.json().catch(() => ({}));
    const schedule = parseSchedule(body);
    if (schedule.error) {
      return NextResponse.json({ error: schedule.error }, { status: 400 });
    }

    profile.scheduledRegistrationAt = schedule.scheduledAt;
    profile.scheduledCountry = schedule.country;
    profile.scheduledCity = schedule.city;
    profile.scheduledTimeZone = schedule.timeZone;
    await profile.save();

    return NextResponse.json({
      success: true,
      scheduledRegistrationAt: schedule.scheduledAt,
      scheduledCountry: schedule.country,
      scheduledCity: schedule.city,
      scheduledTimeZone: schedule.timeZone,
    });
  } catch (err) {
    console.error("Update scheduled onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
