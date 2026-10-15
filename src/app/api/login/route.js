import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    await connectToDatabase();
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials (user not found)" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials (bad password)" },
        { status: 401 }
      );
    }

    // Scheduled clients get their credentials set up front but may not log in before activation
    if (user.role === "client" && user.isActive === false) {
      return NextResponse.json(
        { error: "This account is not active yet" },
        { status: 403 }
      );
    }

    // ✅ Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        companyId: user.companyId || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // 1 day instead of 1h
    );

    // ✅ Response with HttpOnly cookie
    const res = NextResponse.json({
      success: true,
      role: user.role,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
