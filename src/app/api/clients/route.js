import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Company from "@/models/Company";
import ClientProfile from "@/models/ClientProfile";

const ALLOWED_CREATOR_ROLES = new Set(["supervisor", "rm", "superadmin"]);

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeEmail = (value) => normalizeString(value).toLowerCase();

const normalizeUsername = (value) => normalizeString(value).toLowerCase();

const buildClientPayload = (profile, user, assignedToUser, createdByUser) => {
  const resolvedUserId = user?._id || profile?.userId || null;
  const assignedToName =
    assignedToUser?.fullName ||
    assignedToUser?.username ||
    profile?.assignedToUserId?.fullName ||
    profile?.assignedToUserId?.username ||
    "";
  let assignedByName = "";

  if (createdByUser?.role === "rm") {
    assignedByName = "Self";
  } else if (createdByUser?.role === "supervisor") {
    assignedByName = createdByUser?.fullName || createdByUser?.username || "";
  } else {
    assignedByName =
      profile?.createdByNameSnapshot ||
      createdByUser?.fullName ||
      createdByUser?.username ||
      "";
  }

  return {
    _id: resolvedUserId,
    userId: resolvedUserId,
    profileId: profile?._id || null,
    username: user?.username || "",
    fullName: user?.fullName || user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyId: profile?.companyId || user?.companyId || null,
    companyName: profile?.companyName || user?.companyName || "",
    assignedToUserId: profile?.assignedToUserId || null,
    assignedToName,
    assignedByName,
    onboarding: profile?.onboarding || null,
    createdAt: profile?.createdAt || null,
  };
};

export async function GET(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ALLOWED_CREATOR_ROLES.has(tokenUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const countOnly = searchParams.get("count");

    const companyId = tokenUser.companyId || null;
    let query = {};

    if (tokenUser.role === "rm") {
      // For RMs, filter by assignedToUserId (primary filter)
      query = {
        assignedToUserId: new mongoose.Types.ObjectId(tokenUser.id),
      };
      // Add companyId filter only if it exists
      if (companyId) {
        query.companyId = companyId;
      }
      console.log("[API /clients GET] RM query:", JSON.stringify(query), "tokenUser.id:", tokenUser.id);
    } else if (tokenUser.role === "supervisor") {
      query = { companyId };
    } else if (tokenUser.role === "superadmin" && companyId) {
      query = { companyId };
    }

    // If only count is requested, return the count
    if (countOnly === "true") {
      const count = await ClientProfile.countDocuments(query);
      console.log("[API /clients GET] Count query result:", count);
      return NextResponse.json({ success: true, count });
    }

    const profiles = await ClientProfile.find(query)
      .populate("userId", "username fullName email phone companyId companyName")
      .populate("assignedToUserId", "username fullName")
      .populate("createdByUserId", "username fullName role")
      .lean();

    console.log("[API /clients GET] Found profiles:", profiles.length);

    const clients = profiles.map((profile) =>
      buildClientPayload(
        profile,
        profile.userId,
        profile.assignedToUserId,
        profile.createdByUserId
      )
    );

    return NextResponse.json({ success: true, clients });
  } catch (err) {
    console.error("Fetch clients error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ALLOWED_CREATOR_ROLES.has(tokenUser.role)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const normalizedUsername = normalizeUsername(body.username);
  const rawPassword = normalizeString(body.password || body.passwordHash);
  const normalizedFullName = normalizeString(body.fullName);
  const normalizedEmail = normalizeEmail(body.email);
  const normalizedPhone = normalizeString(body.phone);

  const missingFields = [];
  if (!normalizedUsername) missingFields.push("username");
  if (!rawPassword) missingFields.push("password");
  if (!normalizedFullName) missingFields.push("fullName");
  if (!normalizedEmail) missingFields.push("email");
  if (!normalizedPhone) missingFields.push("phone");

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: "Missing fields", missing: missingFields, apiVersion: "clients-post-v1" },
      { status: 400 }
    );
  }

  const companyId = tokenUser.companyId || null;
  if (!companyId) {
    return NextResponse.json({ error: "companyId missing from token" }, { status: 400 });
  }

  const assignedToUserId = body.assignedToUserId || null;

  try {
    await connectToDatabase();

    const creatorUser = await User.findById(tokenUser.id).select("fullName username");
    if (!creatorUser) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const company = await Company.findById(companyId).select("name");
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    let resolvedAssignedToUserId = null;
    let assignedToUserSnapshot = null;

    if (tokenUser.role === "rm") {
      resolvedAssignedToUserId = tokenUser.id;
    } else {
      if (!assignedToUserId) {
        return NextResponse.json({ error: "assignedToUserId is required" }, { status: 400 });
      }
      if (!mongoose.isValidObjectId(assignedToUserId)) {
        return NextResponse.json({ error: "assignedToUserId is invalid" }, { status: 400 });
      }
      assignedToUserSnapshot = await User.findOne({
        _id: assignedToUserId,
        role: "rm",
        companyId: new mongoose.Types.ObjectId(companyId),
      }).select("_id fullName username");
      if (!assignedToUserSnapshot) {
        return NextResponse.json(
          { error: "Assigned RM not found for this company" },
          { status: 404 }
        );
      }
      resolvedAssignedToUserId = assignedToUserSnapshot._id;
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = new User({
      username: normalizedUsername,
      passwordHash: hashedPassword,
      role: "client",
      companyId,
      companyName: company.name,
      fullName: normalizedFullName,
      email: normalizedEmail,
      phone: normalizedPhone,
      isActive: true,
      createdBy: tokenUser.id,
    });

    await newUser.save();

    const newProfile = new ClientProfile({
      userId: newUser._id,
      companyId,
      companyName: company.name,
      createdByUserId: tokenUser.id,
      assignedToUserId: resolvedAssignedToUserId,
      createdByNameSnapshot: creatorUser.fullName || creatorUser.username || "",
      onboarding: {
        status: "not_started",
        currentStep: 1,
        completedSteps: [],
      },
    });

    await newProfile.save();

    if (!assignedToUserSnapshot) {
      assignedToUserSnapshot = await User.findById(resolvedAssignedToUserId).select(
        "fullName username"
      );
    }

    return NextResponse.json({
      success: true,
      apiVersion: "clients-post-v1",
      client: buildClientPayload(newProfile, newUser, assignedToUserSnapshot),
    });
  } catch (err) {
    console.error("Create client error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ALLOWED_CREATOR_ROLES.has(tokenUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    let profile = await ClientProfile.findById(id).lean();
    if (!profile) {
      profile = await ClientProfile.findOne({ userId: id }).lean();
    }

    if (!profile) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (tokenUser.role !== "superadmin") {
      if (String(profile.companyId) !== String(tokenUser.companyId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (tokenUser.role === "rm") {
        if (String(profile.assignedToUserId) !== String(tokenUser.id)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    await ClientProfile.findByIdAndDelete(profile._id);
    await User.findByIdAndDelete(profile.userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete client error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!new Set(["supervisor", "superadmin"]).has(tokenUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const assignedToUserId = body?.assignedToUserId || null;

  if (!assignedToUserId) {
    return NextResponse.json({ error: "assignedToUserId is required" }, { status: 400 });
  }

  if (!mongoose.isValidObjectId(assignedToUserId)) {
    return NextResponse.json({ error: "assignedToUserId is invalid" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    let profile = await ClientProfile.findById(id).lean();
    if (!profile) {
      profile = await ClientProfile.findOne({ userId: id }).lean();
    }

    if (!profile) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (
      tokenUser.role !== "superadmin" &&
      String(profile.companyId) !== String(tokenUser.companyId)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const assignedUser = await User.findOne({
      _id: assignedToUserId,
      role: "rm",
      companyId: new mongoose.Types.ObjectId(profile.companyId),
    }).select("_id fullName username");

    if (!assignedUser) {
      return NextResponse.json(
        { error: "Assigned RM not found for this company" },
        { status: 404 }
      );
    }

    await ClientProfile.findByIdAndUpdate(
      profile._id,
      { assignedToUserId: assignedUser._id },
      { new: true }
    );

    const refreshedProfile = await ClientProfile.findById(profile._id)
      .populate("userId", "username fullName email phone companyId companyName")
      .populate("assignedToUserId", "username fullName")
      .populate("createdByUserId", "username fullName role")
      .lean();

    const client = buildClientPayload(
      refreshedProfile,
      refreshedProfile?.userId,
      refreshedProfile?.assignedToUserId,
      refreshedProfile?.createdByUserId
    );

    return NextResponse.json({ success: true, client });
  } catch (err) {
    console.error("Update client assignment error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
