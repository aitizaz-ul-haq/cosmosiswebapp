import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import ClientProfile from "@/models/ClientProfile";
import { decryptSecret } from "@/lib/credentialCrypto";
import { sendCredentialsEmail } from "@/lib/sendCredentialsEmail";

// Activates and emails every scheduled onboarding whose time has arrived.
export async function dispatchScheduledOnboardings(baseUrl) {
  await connectToDatabase();
  const base = String(process.env.APP_URL || baseUrl || "").replace(/\/+$/, "");
  let sent = 0;
  let failed = 0;
  const failedIds = [];

  for (;;) {
    // Atomic claim so concurrent callers never email the same client twice
    const profile = await ClientProfile.findOneAndUpdate(
      {
        status: "scheduled",
        scheduledRegistrationAt: { $lte: new Date() },
        _id: { $nin: failedIds },
      },
      { $set: { status: "ongoing", registeredAt: new Date() } },
      { new: true }
    ).select("+scheduledCredentialsEnc");
    if (!profile) break;

    try {
      const password = decryptSecret(profile.scheduledCredentialsEnc);
      const clientUser = await User.findById(profile.userId);
      if (!clientUser?.email) throw new Error("Client user or email missing");

      const designatedRm = await User.findById(profile.assignedToUserId).select(
        "fullName username email"
      );
      await sendCredentialsEmail({
        to: clientUser.email,
        fullName: clientUser.fullName,
        username: clientUser.username,
        password,
        baseUrl: base,
        loginUrl: `${base}/login`,
        companyName: profile.companyName,
        rmName: designatedRm?.fullName || designatedRm?.username,
        rmEmail: designatedRm?.email,
      });

      clientUser.isActive = true;
      await clientUser.save();
      profile.scheduledCredentialsEnc = "";
      profile.scheduledRegistrationAt = null;
      profile.scheduledCountry = "";
      profile.scheduledCity = "";
      profile.scheduledTimeZone = "";
      await profile.save();
      sent += 1;
    } catch (err) {
      failed += 1;
      failedIds.push(profile._id);
      console.error("Scheduled onboarding dispatch failed:", profile._id, err);
      // Back to scheduled so the next run retries
      await ClientProfile.updateOne(
        { _id: profile._id },
        { $set: { status: "scheduled" }, $unset: { registeredAt: "" } }
      );
    }
  }

  return { sent, failed };
}
