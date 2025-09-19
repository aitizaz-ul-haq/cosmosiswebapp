// src/app/api/log/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import Log from "@/models/Log";

export async function POST(req) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, metadata } = await req.json();

  try {
    await connectToDatabase();

    const log = new Log({
      userId: user.id,
      role: user.role,
      action,
      metadata,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    await log.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Log save error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
