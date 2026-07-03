import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import ClientProfile from "@/models/ClientProfile";

// Returns the logged-in client's own onboarding profile (type + progress + data).
export async function GET(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (tokenUser.role !== "client") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const profile = await ClientProfile.findOne({ userId: tokenUser.id }).lean();

    if (!profile) {
      return NextResponse.json(
        { error: "No onboarding profile found for this client" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      onboardingType: profile.onboardingType || "individual",
      onboarding: profile.onboarding || null,
      profile,
    });
  } catch (err) {
    console.error("Fetch own client profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
