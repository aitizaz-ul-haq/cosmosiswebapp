// src/lib/logger.js
import Log from "@/models/Log";
import { connectToDatabase } from "@/lib/mongodb";

export async function logAction({ user, action, metadata = {}, req }) {
  try {
    await connectToDatabase();

    const log = new Log({
      userId: user.id,
      role: user.role,
      action,
      metadata,
      ip: req?.headers?.get("x-forwarded-for") || "unknown",
      userAgent: req?.headers?.get("user-agent") || "unknown",
    });

    await log.save();
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}
