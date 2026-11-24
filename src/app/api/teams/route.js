import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { isTeamObjectId, validateTeamInput } from "@/lib/teamValidation";
import Team from "@/models/Team";
import User from "@/models/User";

export const dynamic = "force-dynamic";

function authorize(req) {
  const user = verifyToken(req);
  if (!user) return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (user.role !== "supervisor" || !isTeamObjectId(user.companyId) || !isTeamObjectId(user.id)) {
    return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, companyId: user.companyId.toLowerCase() };
}

function teamId(req) {
  const id = new URL(req.url).searchParams.get("id");
  return isTeamObjectId(id) ? id.toLowerCase() : null;
}

async function readForm(req) {
  try {
    return { body: await req.json() };
  } catch {
    return { response: NextResponse.json({ error: "A valid JSON team form is required." }, { status: 400 }) };
  }
}

function managerQuery(companyId, ids) {
  return User.find({
    _id: { $in: ids },
    companyId,
    role: "rm",
    isActive: { $ne: false },
  }).select("_id fullName username email").lean();
}

function person(user) {
  return { _id: String(user._id), fullName: user.fullName || "", username: user.username || "", email: user.email || "" };
}

async function serializeTeams(teams, companyId) {
  const ids = [...new Set(teams.flatMap((team) => [String(team.leaderUserId), ...team.memberUserIds.map(String)]))];
  const managers = ids.length ? await managerQuery(companyId, ids) : [];
  const contacts = new Map(managers.map((manager) => [String(manager._id), person(manager)]));
  return teams.map((team) => ({
    _id: String(team._id),
    name: team.name,
    leaderUserId: String(team.leaderUserId),
    memberUserIds: team.memberUserIds.map(String),
    leader: contacts.get(String(team.leaderUserId)) || null,
    members: team.memberUserIds.map((id) => contacts.get(String(id))).filter(Boolean),
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  }));
}

async function assignmentsAreValid(form, companyId) {
  const ids = [form.leaderUserId, ...form.memberUserIds];
  const managers = await managerQuery(companyId, ids);
  return managers.length === ids.length;
}

function failure(error) {
  if (error?.code === 11000) {
    return NextResponse.json({ error: "A team with this name already exists in your company." }, { status: 409 });
  }
  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return NextResponse.json({ error: "Please check the team details and try again." }, { status: 400 });
  }
  console.error("Teams request failed:", error?.message || "Unknown error");
  return NextResponse.json({ error: "Unable to save or load teams. Please try again." }, { status: 500 });
}

const invalidAssignments = () => NextResponse.json(
  { error: "Select active Investment Managers from your company for the leader and every team member." },
  { status: 400 }
);

export async function GET(req) {
  const auth = authorize(req);
  if (auth.response) return auth.response;
  try {
    await connectToDatabase();
    const teams = await Team.find({ companyId: auth.companyId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ teams: await serializeTeams(teams, auth.companyId) });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(req) {
  const auth = authorize(req);
  if (auth.response) return auth.response;
  const parsed = await readForm(req);
  if (parsed.response) return parsed.response;
  const validated = validateTeamInput(parsed.body);
  if (validated.error) return NextResponse.json({ error: validated.error }, { status: 400 });
  try {
    await connectToDatabase();
    if (!await assignmentsAreValid(validated.value, auth.companyId)) return invalidAssignments();
    // Wait for the new collection's unique name index before accepting writes.
    await Team.init();
    const team = await Team.create({
      ...validated.value,
      companyId: auth.companyId,
      createdByUserId: auth.user.id,
    });
    return NextResponse.json({ team: (await serializeTeams([team], auth.companyId))[0] }, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(req) {
  const auth = authorize(req);
  if (auth.response) return auth.response;
  const id = teamId(req);
  if (!id) return NextResponse.json({ error: "A valid team ID is required." }, { status: 400 });
  const parsed = await readForm(req);
  if (parsed.response) return parsed.response;
  const patch = validateTeamInput(parsed.body, { partial: true });
  if (patch.error) return NextResponse.json({ error: patch.error }, { status: 400 });
  try {
    await connectToDatabase();
    const existing = await Team.findOne({ _id: id, companyId: auth.companyId }).lean();
    if (!existing) return NextResponse.json({ error: "Team not found." }, { status: 404 });
    const merged = validateTeamInput({
      name: patch.value.name ?? existing.name,
      leaderUserId: patch.value.leaderUserId ?? String(existing.leaderUserId),
      memberUserIds: patch.value.memberUserIds ?? existing.memberUserIds.map(String),
    });
    if (merged.error) return NextResponse.json({ error: merged.error }, { status: 400 });
    if (!await assignmentsAreValid(merged.value, auth.companyId)) return invalidAssignments();
    await Team.init();
    const team = await Team.findOneAndUpdate(
      { _id: id, companyId: auth.companyId },
      { $set: merged.value },
      { new: true, runValidators: true }
    ).lean();
    if (!team) return NextResponse.json({ error: "Team not found." }, { status: 404 });
    return NextResponse.json({ team: (await serializeTeams([team], auth.companyId))[0] });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(req) {
  const auth = authorize(req);
  if (auth.response) return auth.response;
  const id = teamId(req);
  if (!id) return NextResponse.json({ error: "A valid team ID is required." }, { status: 400 });
  try {
    await connectToDatabase();
    const removed = await Team.findOneAndDelete({ _id: id, companyId: auth.companyId }).lean();
    if (!removed) return NextResponse.json({ error: "Team not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return failure(error);
  }
}
