// src/app/api/log/route.js
import { NextResponse } from "next/server";
import { logAction } from "@/lib/logger";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, metadata } = await req.json();

    await logAction({
      user,
      action,
      metadata,
      req,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Log API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
