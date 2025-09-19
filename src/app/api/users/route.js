import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, password, role, companyId } = await req.json();

  if (!username || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // ✅ Role-based creation rules
  if (tokenUser.role === "superadmin") {
    if (role !== "supervisor" || !companyId) {
      return NextResponse.json(
        {
          error:
            "Superadmin must assign companyId and can only create supervisors",
        },
        { status: 403 }
      );
    }
  } else if (tokenUser.role === "supervisor") {
    if (role !== "rm") {
      return NextResponse.json(
        { error: "Supervisors can only create RMs" },
        { status: 403 }
      );
    }
  } else if (tokenUser.role === "rm") {
    if (role !== "client") {
      return NextResponse.json(
        { error: "RMs can only create clients" },
        { status: 403 }
      );
    }
  } else {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      passwordHash: hashedPassword, // ✅ match schema
      role,
      companyId: companyId || tokenUser.companyId,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      user: {
        username: newUser.username,
        role: newUser.role,
        companyId: newUser.companyId,
      },
    });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
