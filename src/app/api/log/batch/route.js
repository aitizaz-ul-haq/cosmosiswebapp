// src/app/api/log/batch/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Log from "@/models/Log";
import { verifyToken } from "@/lib/auth";
import { resolveLogIdentity } from "@/lib/enrichLog";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { logs } = await req.json();
    const tokenUser = verifyToken(req);

    // Resolve identity once per request (all logs in a batch share the same user)
    const identity = await resolveLogIdentity(tokenUser);

    const enrichedLogs = (Array.isArray(logs) ? logs : []).map((l) => {
      const metadata = l.metadata || {};
      return {
        userId: tokenUser?.id || null,
        role: identity.role,
        name: identity.name || metadata.username || null,
        username: identity.username || metadata.username || null,
        companyId: identity.companyId,
        companyName: identity.companyName,
        action: l.action,
        actionTitle: metadata.title || null,
        metadata,
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
        createdAt: new Date(l.timestamp || Date.now()),
      };
    });

    if (enrichedLogs.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    await Log.insertMany(enrichedLogs);

    return NextResponse.json({ success: true, count: enrichedLogs.length });
  } catch (err) {
    console.error("Batch log error:", err);
    return NextResponse.json({ error: "Failed to save logs" }, { status: 500 });
  }
}
