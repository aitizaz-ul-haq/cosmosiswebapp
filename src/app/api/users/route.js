import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Company from "@/models/Company";

export async function POST(req) {
  try {
    const authUser = verifyToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { username, password, role, companyId } = await req.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Role-based creation rules
    if (authUser.role === "superadmin" && role === "supervisor") {
      // OK, must specify companyId
      if (!companyId) {
        return NextResponse.json(
          { error: "Company ID required" },
          { status: 400 }
        );
      }
    } else if (authUser.role === "supervisor" && role === "rm") {
      // Supervisor can only create RMs in their company
      if (companyId !== authUser.companyId) {
        return NextResponse.json(
          { error: "Invalid company access" },
          { status: 403 }
        );
      }
    } else if (authUser.role === "rm" && role === "client") {
      // RM can only create clients in their company
      if (companyId !== authUser.companyId) {
        return NextResponse.json(
          { error: "Invalid company access" },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      passwordHash,
      role,
      companyId,
      createdBy: authUser.id,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      user: { username, role, companyId },
    });
  } catch (err) {
    console.error("User creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
