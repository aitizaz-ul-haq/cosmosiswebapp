// src/app/api/me/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  const decoded = verifyToken(req);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findById(decoded.id)
      .select("-passwordHash")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const decoded = verifyToken(req);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fullName, email, phone } = body;

    await connectToDatabase();
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update only allowed fields
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.passwordHash;

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
