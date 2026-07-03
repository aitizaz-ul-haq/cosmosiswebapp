/* eslint-disable */
// Seed / normalize Nemesis example clients with the new client data model so the
// phased status ovals are visible across all 6 onboarding phases.
//
// Run: export $(grep MONGODB_URI .env.local | xargs) && node scripts/seedNemesisClients.js
const mongoose = require("mongoose");

const COMPANY_ID = "6989cd6585f3277b00e85b89"; // Nemesis
const WAJID_ID = "698aead4aff38f427b9d698a"; // RM Wajid Khan
const KEITH_ID = "698aea03aff38f427b9d697c"; // RM Keith Brown

// clientFullName -> desired demo configuration
// phase drives onboarding.currentStep (1..6) which maps to the % oval in the UI.
const PLAN = [
  { name: "Nemesis Test Client One", phase: 1, assignedTo: WAJID_ID, shared: [] },
  { name: "Nemesis Test Client Two", phase: 2, assignedTo: WAJID_ID, shared: [] },
  { name: "Nemesis Test Client Three", phase: 3, assignedTo: WAJID_ID, shared: [] },
  { name: "Nemesis Test Client Four", phase: 4, assignedTo: WAJID_ID, shared: [KEITH_ID] },
  { name: "Nemesis Test Client Five", phase: 5, assignedTo: KEITH_ID, shared: [] },
  { name: "Nemesis Test Client Six", phase: 6, assignedTo: KEITH_ID, shared: [WAJID_ID] },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  await mongoose.connect(uri, { bufferCommands: false });

  const companyId = new mongoose.Types.ObjectId(COMPANY_ID);
  const usersCol = mongoose.connection.collection("users");
  const profilesCol = mongoose.connection.collection("clientprofiles");

  for (const item of PLAN) {
    const user = await usersCol.findOne({ companyId, fullName: item.name });
    if (!user) {
      console.log(`SKIP (user not found): ${item.name}`);
      continue;
    }

    const completedSteps = [];
    for (let s = 1; s < item.phase; s += 1) completedSteps.push(s);

    const shared = item.shared.map((id) => new mongoose.Types.ObjectId(id));

    const res = await profilesCol.updateOne(
      { userId: user._id },
      {
        $set: {
          assignedToUserId: new mongoose.Types.ObjectId(item.assignedTo),
          status: "ongoing",
          onboardingType: "individual",
          isShared: shared.length > 0,
          sharedWithUserIds: shared,
          "onboarding.currentStep": item.phase,
          "onboarding.completedSteps": completedSteps,
          "onboarding.status": item.phase >= 6 ? "submitted" : "in_progress",
        },
      }
    );
    console.log(
      `${item.name} -> phase ${item.phase} (matched ${res.matchedCount}, modified ${res.modifiedCount})`
    );
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
