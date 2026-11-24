import mongoose from "mongoose";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { documentBucket, documentFilename, documentRange, documentSession } from "@/lib/documentStorage";
import ClientProfile from "@/models/ClientProfile";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const INLINE_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp", "text/plain"]);

async function serve(req, { params }, head = false) {
  const session = documentSession(req, ["client", "supervisor"]);
  if (session.error) return NextResponse.json({ error: session.error }, { status: session.status });
  const id = params.id;
  if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ error: "Invalid document ID." }, { status: 400 });
  const { user } = session;
  try {
    await connectToDatabase();
    if (user.role === "client") {
      const account = await User.findOne({ _id: user.id, companyId: user.companyId, role: "client", isActive: { $ne: false } }).select("_id").lean();
      if (!account) return NextResponse.json({ error: "Your client account is unavailable." }, { status: 403 });
    }
    const bucket = documentBucket();
    const storageId = new mongoose.Types.ObjectId(id);
    const file = await bucket.find({ _id: storageId, "metadata.companyId": user.companyId, ...(user.role === "client" ? { "metadata.userId": user.id } : {}) }).next();
    if (!file) return NextResponse.json({ error: "Document not found." }, { status: 404 });
    const profile = await ClientProfile.findOne({ _id: file.metadata.profileId, companyId: user.companyId, "documents.uploads.storageId": storageId, ...(user.role === "client" ? { userId: user.id } : {}) }).select("_id").lean();
    if (!profile) return NextResponse.json({ error: "Document not found." }, { status: 404 });
    const range = documentRange(req.headers.get("range"), file.length);
    if (!range) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${file.length}`, "Cache-Control": "private, no-store" } });
    const mimeType = file.metadata?.mimeType;
    const inline = INLINE_TYPES.has(mimeType);
    const filename = documentFilename(file.filename) || "document";
    const headers = {
      "Content-Type": inline ? mimeType : "application/octet-stream",
      "Content-Length": String(range.end - range.start + 1),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="document"; filename*=UTF-8''${encodeURIComponent(filename).replace(/'/g, "%27")}`,
      "Cache-Control": "private, no-store",
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "no-referrer",
      "Cross-Origin-Resource-Policy": "same-origin",
    };
    if (range.partial) headers["Content-Range"] = `bytes ${range.start}-${range.end}/${file.length}`;
    const body = head ? null : Readable.toWeb(bucket.openDownloadStream(storageId, { start: range.start, end: range.end + 1 }));
    return new Response(body, { status: range.partial ? 206 : 200, headers });
  } catch (error) {
    console.error("Document read failed:", error?.message);
    return NextResponse.json({ error: "Unable to open the document. Please try again." }, { status: 500 });
  }
}

export function GET(req, context) { return serve(req, context); }
export function HEAD(req, context) { return serve(req, context, true); }
