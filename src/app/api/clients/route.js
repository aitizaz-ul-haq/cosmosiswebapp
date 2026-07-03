import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Company from "@/models/Company";
import ClientProfile from "@/models/ClientProfile";

const ALLOWED_CREATOR_ROLES = new Set(["supervisor", "rm", "superadmin"]);

// Phase-to-progress mapping per onboarding type.
// Individual form has 6 phases with these completion percentages.
const PHASE_PROGRESS = {
  individual: [20, 35, 50, 65, 80, 100],
};

// Compute the completion percentage for a given onboarding type + step (1-based).
const computeProgress = (onboardingType, currentStep) => {
  const map = PHASE_PROGRESS[onboardingType] || PHASE_PROGRESS.individual;
  const step = Number(currentStep) || 1;
  const clamped = Math.min(Math.max(step, 1), map.length);
  return map[clamped - 1];
};

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

  // Shared RMs (populated docs when available, otherwise raw ids)
  const sharedList = Array.isArray(profile?.sharedWithUserIds)
    ? profile.sharedWithUserIds
    : [];
  const sharedWithUserIds = sharedList.map((rm) =>
    rm && typeof rm === "object" && rm._id ? String(rm._id) : String(rm)
  );
  const sharedWithNames = sharedList
    .map((rm) =>
      rm && typeof rm === "object" ? rm.fullName || rm.username || "" : ""
    )
    .filter(Boolean);

  const resolvedOnboardingType = profile?.onboardingType || "individual";
  // Ensure progress is always present (backfill legacy records from currentStep)
  const onboardingData = profile?.onboarding
    ? {
        ...(profile.onboarding.toObject
          ? profile.onboarding.toObject()
          : profile.onboarding),
      }
    : null;
  if (onboardingData) {
    onboardingData.progress =
      typeof onboardingData.progress === "number" && onboardingData.progress > 0
        ? onboardingData.progress
        : computeProgress(resolvedOnboardingType, onboardingData.currentStep);
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
    isShared: Boolean(profile?.isShared),
    sharedWithUserIds,
    sharedWithNames,
    status: profile?.status || "ongoing",
    onboardingType: resolvedOnboardingType,
    onboarding: onboardingData,
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
      // For RMs, show clients they own (assignedToUserId) OR that are shared with them
      const rmObjectId = new mongoose.Types.ObjectId(tokenUser.id);
      query = {
        $or: [{ assignedToUserId: rmObjectId }, { sharedWithUserIds: rmObjectId }],
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
      .populate("sharedWithUserIds", "username fullName")
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

  // New client attributes (with safe defaults / validation)
  const ALLOWED_STATUS = new Set(["ongoing", "on_hold", "cancelled"]);
  const ALLOWED_ONBOARDING_TYPE = new Set(["individual", "joint", "corporate", "trust"]);
  const status = ALLOWED_STATUS.has(body.status) ? body.status : "ongoing";
  const onboardingType = ALLOWED_ONBOARDING_TYPE.has(body.onboardingType)
    ? body.onboardingType
    : "individual";
  const isSharedRequested = Boolean(body.isShared);
  const requestedSharedIds = Array.isArray(body.sharedWithUserIds)
    ? body.sharedWithUserIds.filter((v) => mongoose.isValidObjectId(v)).map(String)
    : [];

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

    // Resolve shared RMs (supervisor/superadmin only). Exclude the primary RM
    // and de-duplicate; every id must be a real RM in this company.
    let resolvedSharedIds = [];
    if (tokenUser.role !== "rm" && isSharedRequested && requestedSharedIds.length > 0) {
      const uniqueRequested = [...new Set(requestedSharedIds)].filter(
        (rmId) => String(rmId) !== String(resolvedAssignedToUserId)
      );
      if (uniqueRequested.length > 0) {
        const validSharedRms = await User.find({
          _id: { $in: uniqueRequested },
          role: "rm",
          companyId: new mongoose.Types.ObjectId(companyId),
        }).select("_id");
        resolvedSharedIds = validSharedRms.map((rm) => rm._id);
      }
    }
    const isShared = resolvedSharedIds.length > 0;

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
      isShared,
      sharedWithUserIds: resolvedSharedIds,
      status,
      onboardingType,
      onboarding: {
        status: "not_started",
        currentStep: 1,
        completedSteps: [],
        progress: computeProgress(onboardingType, 1),
      },
    });

    await newProfile.save();

    if (!assignedToUserSnapshot) {
      assignedToUserSnapshot = await User.findById(resolvedAssignedToUserId).select(
        "fullName username"
      );
    }

    // Populate shared RM names for the response payload
    if (resolvedSharedIds.length > 0) {
      const sharedDocs = await User.find({ _id: { $in: resolvedSharedIds } }).select(
        "fullName username"
      );
      newProfile.sharedWithUserIds = sharedDocs;
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

  const ALLOWED_STATUS = new Set(["ongoing", "on_hold", "cancelled"]);
  const ALLOWED_ONBOARDING_TYPE = new Set(["individual", "joint", "corporate", "trust"]);
  const hasStatus = typeof body.status === "string" && ALLOWED_STATUS.has(body.status);
  const hasOnboardingType =
    typeof body.onboardingType === "string" &&
    ALLOWED_ONBOARDING_TYPE.has(body.onboardingType);
  const hasShared = Array.isArray(body.sharedWithUserIds);

  // At least one updatable field must be present
  if (!assignedToUserId && !hasStatus && !hasOnboardingType && !hasShared) {
    return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
  }

  if (assignedToUserId && !mongoose.isValidObjectId(assignedToUserId)) {
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

    const update = {};

    if (assignedToUserId) {
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
      update.assignedToUserId = assignedUser._id;
    }

    if (hasStatus) update.status = body.status;
    if (hasOnboardingType) update.onboardingType = body.onboardingType;

    if (hasShared) {
      const primaryRm = String(update.assignedToUserId || profile.assignedToUserId);
      const requested = body.sharedWithUserIds
        .filter((v) => mongoose.isValidObjectId(v))
        .map(String)
        .filter((rmId) => rmId !== primaryRm);
      const uniqueRequested = [...new Set(requested)];
      let resolvedSharedIds = [];
      if (uniqueRequested.length > 0) {
        const validSharedRms = await User.find({
          _id: { $in: uniqueRequested },
          role: "rm",
          companyId: new mongoose.Types.ObjectId(profile.companyId),
        }).select("_id");
        resolvedSharedIds = validSharedRms.map((rm) => rm._id);
      }
      update.sharedWithUserIds = resolvedSharedIds;
      update.isShared = resolvedSharedIds.length > 0;
    }

    await ClientProfile.findByIdAndUpdate(profile._id, update, { new: true });

    const refreshedProfile = await ClientProfile.findById(profile._id)
      .populate("userId", "username fullName email phone companyId companyName")
      .populate("assignedToUserId", "username fullName")
      .populate("createdByUserId", "username fullName role")
      .populate("sharedWithUserIds", "username fullName")
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
