import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import ClientProfile from "@/models/ClientProfile";
import User from "@/models/User";

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

    let assignedRm = null;
    if (
      profile.assignedToUserId &&
      profile.companyId &&
      String(profile.companyId) === String(tokenUser.companyId)
    ) {
      const rm = await User.findOne({
        _id: profile.assignedToUserId,
        role: "rm",
        companyId: profile.companyId,
      })
        .select("fullName username email -_id")
        .lean();

      if (rm) {
        assignedRm = {
          name: rm.fullName || rm.username || "",
          email: rm.email || "",
        };
      }
    }

    return NextResponse.json({
      success: true,
      onboardingType: profile.onboardingType || "individual",
      onboarding: profile.onboarding || null,
      assignedRm,
      profile,
    });
  } catch (err) {
    console.error("Fetch own client profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
