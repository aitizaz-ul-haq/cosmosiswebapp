import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Company from "@/models/Company";
import mongoose from "mongoose";

export async function POST(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await req.json();
  // console.log("[POST /api/users] body", requestBody);
  const { username, password, passwordHash, role, companyId, fullName, email, phone } = requestBody;
  const rawPassword = password ?? passwordHash;
  const normalizedUsername = username?.trim()?.toLowerCase() || "";
  const normalizedFullName = fullName?.trim() || "";
  const normalizedEmail = email?.trim()?.toLowerCase() || "";
  const normalizedPhone = phone?.trim() || "";

  const missingFields = [];
  if (!normalizedUsername) missingFields.push("username");
  if (!rawPassword) missingFields.push("password");
  if (!role) missingFields.push("role");
  if (!normalizedFullName) missingFields.push("fullName");
  if (!normalizedEmail) missingFields.push("email");
  if (!normalizedPhone) missingFields.push("phone");

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: "Missing fields", missing: missingFields, apiVersion: "users-post-v3" },
      { status: 400 }
    );
  }

  // ✅ Role-based creation rules
  if (tokenUser.role === "superadmin") {
    if (role !== "superadmin" && !companyId) {
      return NextResponse.json(
        { error: "Superadmin must assign companyId for non-superadmin users" },
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

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const resolvedCompanyId = companyId || tokenUser.companyId || null;
    let resolvedCompanyName = null;

    if (resolvedCompanyId) {
      const company = await Company.findById(resolvedCompanyId).select("name");
      if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
      }
      resolvedCompanyName = company.name;
    }

    if (role !== "superadmin" && !resolvedCompanyId) {
      return NextResponse.json({ error: "companyId is required" }, { status: 400 });
    }

    const newUser = new User({
      username: normalizedUsername,
      passwordHash: hashedPassword, // ✅ match schema
      role,
      companyId: resolvedCompanyId,
      companyName: resolvedCompanyName,
      fullName: normalizedFullName,
      email: normalizedEmail,
      phone: normalizedPhone,
      createdBy: tokenUser?.id || null,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      apiVersion: "users-post-v3",
      user: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        companyId: newUser.companyId,
        companyName: newUser.companyName,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const query =
      tokenUser.role === "superadmin"
        ? {}
        : { companyId: new mongoose.Types.ObjectId(tokenUser.companyId) };

    const users = await User.find(query)
      .select("username fullName email phone role companyId companyName")
      .populate("companyId", "name")
      .lean();

    const normalizedUsers = users.map((user) => {
      const companyId = user.companyId?._id || user.companyId || null;
      const companyName = user.companyName || user.companyId?.name || "";

      return {
        ...user,
        companyId,
        companyName,
        fullName: user.fullName || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      };
    });

    const filteredUsers = normalizedUsers.filter(
      (user) => user.fullName && user.email && user.phone
    );

    return NextResponse.json({ success: true, users: filteredUsers });
  } catch (err) {
    console.error("Fetch users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      tokenUser.role !== "superadmin" &&
      String(user.companyId) !== String(tokenUser.companyId)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      tokenUser.role !== "superadmin" &&
      String(user.companyId) !== String(tokenUser.companyId)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const update = {};

    if (typeof body.username === "string") {
      const normalizedUsername = body.username.trim().toLowerCase();
      if (!normalizedUsername) {
        return NextResponse.json({ error: "username cannot be empty" }, { status: 400 });
      }
      update.username = normalizedUsername;
    }

    if (typeof body.fullName === "string") {
      const normalizedFullName = body.fullName.trim();
      if (!normalizedFullName) {
        return NextResponse.json({ error: "fullName cannot be empty" }, { status: 400 });
      }
      update.fullName = normalizedFullName;
    }

    if (typeof body.email === "string") {
      const normalizedEmail = body.email.trim().toLowerCase();
      if (!normalizedEmail) {
        return NextResponse.json({ error: "email cannot be empty" }, { status: 400 });
      }
      update.email = normalizedEmail;
    }

    if (typeof body.phone === "string") {
      const normalizedPhone = body.phone.trim();
      if (!normalizedPhone) {
        return NextResponse.json({ error: "phone cannot be empty" }, { status: 400 });
      }
      update.phone = normalizedPhone;
    }

    const canEditRoleAndCompany = tokenUser.role === "superadmin";

    if (canEditRoleAndCompany && typeof body.role === "string") {
      update.role = body.role;
    }

    if (canEditRoleAndCompany && typeof body.companyId === "string") {
      update.companyId = body.companyId || null;
    }

    if (typeof body.password === "string" && body.password.trim() !== "") {
      update.passwordHash = await bcrypt.hash(body.password, 10);
    }

    const nextRole = update.role ?? user.role;
    let nextCompanyId = update.companyId ?? user.companyId ?? null;
    let nextCompanyName = user.companyName ?? null;

    if (nextRole === "superadmin") {
      nextCompanyId = null;
      nextCompanyName = null;
    } else if (nextCompanyId) {
      const company = await Company.findById(nextCompanyId).select("name");
      if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
      }
      nextCompanyName = company.name;
    } else {
      return NextResponse.json({ error: "companyId is required for non-superadmin users" }, { status: 400 });
    }

    update.role = nextRole;
    update.companyId = nextCompanyId;
    update.companyName = nextCompanyName;

    const updatedUser = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).select("username fullName email phone role companyId companyName");

    const normalizedUser = updatedUser
      ? {
          ...updatedUser.toObject(),
          companyId: updatedUser.companyId?._id || updatedUser.companyId || null,
          companyName: updatedUser.companyName || "",
        }
      : null;

    return NextResponse.json({
      success: true,
      user: normalizedUser,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
