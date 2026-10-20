import { NextResponse } from "next/server";

export async function POST() {
  // Clear JWT cookie
  const res = NextResponse.json({ success: true }, {
    headers: { "Cache-Control": "no-store" },
  });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0), // expire immediately
  });
  return res;
}
