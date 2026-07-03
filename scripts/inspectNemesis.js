/* eslint-disable */
// One-off inspection: find the Nemesis company + its supervisor/RM.
// Run: export $(grep MONGODB_URI .env.local | xargs) && node scripts/inspectNemesis.js
const mongoose = require("mongoose");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  await mongoose.connect(uri, { bufferCommands: false });

  const companies = await mongoose.connection
    .collection("companies")
    .find({ name: /nemesis/i })
    .toArray();
  console.log("COMPANIES:", companies.map((c) => ({ _id: String(c._id), name: c.name })));

  for (const c of companies) {
    const users = await mongoose.connection
      .collection("users")
      .find({ companyId: c._id })
      .project({ passwordHash: 0 })
      .toArray();
    console.log(
      `USERS for ${c.name}:`,
      users.map((u) => ({ _id: String(u._id), role: u.role, fullName: u.fullName, username: u.username }))
    );
    const profiles = await mongoose.connection
      .collection("clientprofiles")
      .countDocuments({ companyId: c._id });
    console.log(`  existing clientprofiles: ${profiles}`);
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
