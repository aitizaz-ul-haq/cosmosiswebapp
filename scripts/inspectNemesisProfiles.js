/* eslint-disable */
// Inspect existing Nemesis client profiles.
const mongoose = require("mongoose");

async function main() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri, { bufferCommands: false });
  const companyId = new mongoose.Types.ObjectId("6989cd6585f3277b00e85b89");
  const profiles = await mongoose.connection
    .collection("clientprofiles")
    .find({ companyId })
    .toArray();
  const users = await mongoose.connection
    .collection("users")
    .find({ companyId })
    .project({ fullName: 1 })
    .toArray();
  const nameById = Object.fromEntries(users.map((u) => [String(u._id), u.fullName]));
  console.log(
    profiles.map((p) => ({
      profileId: String(p._id),
      client: nameById[String(p.userId)] || String(p.userId),
      assignedTo: nameById[String(p.assignedToUserId)] || String(p.assignedToUserId),
      status: p.status,
      onboardingType: p.onboardingType,
      isShared: p.isShared,
      sharedWith: (p.sharedWithUserIds || []).map((id) => nameById[String(id)] || String(id)),
      currentStep: p.onboarding?.currentStep,
      completedSteps: p.onboarding?.completedSteps,
    }))
  );
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
