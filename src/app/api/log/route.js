// src/app/api/log/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Log from "@/models/Log";
import { verifyToken } from "@/lib/auth";
import { resolveLogIdentity } from "@/lib/enrichLog";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { action, metadata = {} } = await req.json();

    const tokenUser = verifyToken(req); // may be null
    const identity = await resolveLogIdentity(tokenUser, metadata);

    const log = new Log({
      userId: tokenUser?.id || null,
      role: identity.role,
      name: identity.name,
      username: identity.username,
      companyId: identity.companyId,
      companyName: identity.companyName,
      action,
      actionTitle: metadata?.title || null,
      metadata,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    await log.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Log API error:", err);
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}
