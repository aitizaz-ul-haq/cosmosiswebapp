// scripts/backfillLogs.js
//
// One-time migration: populates name / username / companyName / companyId on
// existing log documents that were created before those fields existed.
//
// Usage:
//   export $(grep MONGODB_URI .env.local | xargs) && node scripts/backfillLogs.js
//
try {
  require("dotenv").config({ path: ".env.local" });
} catch {
  // dotenv is optional; MONGODB_URI can be provided via the environment instead
}
const mongoose = require("mongoose");

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const Logs = mongoose.connection.collection("logs");
  const Users = mongoose.connection.collection("users");

  // Cache users by _id to avoid repeat lookups
  const userCache = new Map();
  async function getUser(id) {
    const key = String(id);
    if (userCache.has(key)) return userCache.get(key);
    const u = await Users.findOne(
      { _id: id },
      { projection: { fullName: 1, username: 1, companyId: 1, companyName: 1, role: 1 } }
    );
    userCache.set(key, u);
    return u;
  }

  const cursor = Logs.find({
    userId: { $ne: null },
    $or: [{ name: { $exists: false } }, { name: null }],
  });

  let updated = 0;
  let skipped = 0;

  while (await cursor.hasNext()) {
    const log = await cursor.next();
    const user = await getUser(log.userId);

    if (!user) {
      skipped++;
      continue;
    }

    const name = user.fullName || user.username || null;
    await Logs.updateOne(
      { _id: log._id },
      {
        $set: {
          name,
          username: user.username || log?.metadata?.username || null,
          companyId: user.companyId || null,
          companyName: user.companyName || null,
          actionTitle: log?.metadata?.title || null,
          role: log.role || user.role || "guest",
        },
      }
    );
    updated++;
  }

  console.log(`Backfill complete. Updated: ${updated}, skipped (no user): ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
