import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { normalizeClientDocuments } from "@/lib/clientDocuments";
import ClientProfile from "@/models/ClientProfile";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const validId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

export async function GET(req) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "supervisor" || !validId(user.companyId) || !validId(user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const companyId = user.companyId.toLowerCase();
  try {
    await connectToDatabase();
    const profiles = await ClientProfile.find({ companyId })
      .select("_id userId documents.uploads")
      .populate({ path: "userId", model: User, select: "_id fullName username", match: { companyId, role: "client" } })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ clients: profiles.map(normalizeClientDocuments) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Client documents request failed:", error?.message || "Unknown error");
    return NextResponse.json({ error: "Unable to load submitted documents. Please try again." }, { status: 500 });
  }
}
