import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    // console.log("👉 Login attempt:", { username, password });

    await connectToDatabase();
    const user = await User.findOne({ username });
    // console.log("👉 User found in DB:", user);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials (user not found)" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    // console.log("👉 Password valid?", valid);

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials (bad password)" }, { status: 401 });
    }

    // JWT + cookie
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        companyId: user.companyId || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({ success: true, role: user.role });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
