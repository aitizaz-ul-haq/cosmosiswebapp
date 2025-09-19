// src/app/api/log/batch/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Log from "@/models/Log";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { logs } = await req.json();
    const tokenUser = verifyToken(req);

    const enrichedLogs = logs.map((l) => ({
      userId: tokenUser?.id || null,
      role: tokenUser?.role || "guest",
      action: l.action,
      metadata: l.metadata,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      createdAt: new Date(l.timestamp || Date.now()),
    }));

    await Log.insertMany(enrichedLogs);

    return NextResponse.json({ success: true, count: enrichedLogs.length });
  } catch (err) {
    console.error("Batch log error:", err);
    return NextResponse.json({ error: "Failed to save logs" }, { status: 500 });
  }
}
