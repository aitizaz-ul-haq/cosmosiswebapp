import { NextResponse } from "next/server";

export async function POST() {
  // Clear JWT cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // expire immediately
  });
  return res;
}
