// src/app/api/logs/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Log from "@/models/Log";
import { verifyToken } from "@/lib/auth";

const MAX_RESULTS = 5000;

// Escapes user-provided strings before using them in a RegExp (prevents ReDoS / injection)
function escapeRegex(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req) {
  try {
    const tokenUser = verifyToken(req);

    // 🔒 Only the superadmin can read the audit logs
    if (!tokenUser || tokenUser.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate"); // ISO date/datetime
    const endDate = searchParams.get("endDate"); // ISO date/datetime
    const company = searchParams.get("company");
    const username = searchParams.get("username");
    const action = searchParams.get("action");
    const limit = Math.min(Number(searchParams.get("limit")) || 1000, MAX_RESULTS);

    const query = {};

    // 🕒 Timeline range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const from = new Date(startDate);
        if (!isNaN(from.getTime())) query.createdAt.$gte = from;
      }
      if (endDate) {
        const to = new Date(endDate);
        if (!isNaN(to.getTime())) query.createdAt.$lte = to;
      }
      if (Object.keys(query.createdAt).length === 0) delete query.createdAt;
    }

    // 🏢 Company filter
    if (company && company.trim() !== "") {
      query.companyName = { $regex: escapeRegex(company.trim()), $options: "i" };
    }

    // 👤 Username / name filter
    if (username && username.trim() !== "") {
      const rx = { $regex: escapeRegex(username.trim()), $options: "i" };
      query.$or = [{ username: rx }, { name: rx }];
    }

    // ⚡ Action filter
    if (action && action.trim() !== "") {
      query.action = { $regex: escapeRegex(action.trim()), $options: "i" };
    }

    const logs = await Log.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (err) {
    console.error("Logs fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
