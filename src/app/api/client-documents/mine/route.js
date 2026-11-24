import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { documentSession } from "@/lib/documentStorage";
import { normalizeClientDocuments } from "@/lib/clientDocuments";
import ClientProfile from "@/models/ClientProfile";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = documentSession(req, ["client"]);
  if (session.error) return NextResponse.json({ error: session.error }, { status: session.status });
  const { user } = session;
  try {
    await connectToDatabase();
    const account = await User.findOne({ _id: user.id, companyId: user.companyId, role: "client", isActive: { $ne: false } }).select("_id").lean();
    if (!account) return NextResponse.json({ error: "Your client account is unavailable." }, { status: 403 });
    const profile = await ClientProfile.findOne({ userId: user.id, companyId: user.companyId }).select("_id userId status documents.uploads").lean();
    if (!profile) return NextResponse.json({ error: "Client profile not found." }, { status: 404 });
    const data = normalizeClientDocuments(profile);
    return NextResponse.json({ documents: data.documents, documentCount: data.documentCount, totalSizeBytes: data.totalSizeBytes, knownSizeBytes: data.knownSizeBytes, unknownSizeCount: data.unknownSizeCount, canUpload: profile.status === "ongoing", message: profile.status === "ongoing" ? "" : "Document uploads are available while your onboarding is in progress." }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Own documents request failed:", error?.message);
    return NextResponse.json({ error: "Unable to load your documents. Please try again." }, { status: 500 });
  }
}
