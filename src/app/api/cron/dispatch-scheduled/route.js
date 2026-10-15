import { NextResponse } from "next/server";
import { dispatchScheduledOnboardings } from "@/lib/dispatchScheduledOnboardings";

// Call on a schedule (e.g. every minute) with `Authorization: Bearer <CRON_SECRET>`.
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await dispatchScheduledOnboardings(new URL(req.url).origin);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("Dispatch scheduled onboardings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
