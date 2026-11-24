import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { documentBucket, documentFilename, documentMime, documentSession, validDocumentSize } from "@/lib/documentStorage";
import { MAX_DOCUMENT_BYTES, DOCUMENT_UPLOAD_HELP } from "@/lib/documentUploadRules";
import { normalizeClientDocuments } from "@/lib/clientDocuments";
import ClientProfile from "@/models/ClientProfile";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function uploadResponse(profile, upload, status = 200) {
  const data = normalizeClientDocuments(profile);
  return NextResponse.json({ document: data.documents.find((document) => document.url === upload.url), documents: data.documents, documentCount: data.documentCount, totalSizeBytes: data.totalSizeBytes, knownSizeBytes: data.knownSizeBytes, unknownSizeCount: data.unknownSizeCount }, { status });
}

export async function POST(req) {
  const session = documentSession(req, ["client"]);
  if (session.error) return NextResponse.json({ error: session.error }, { status: session.status });
  const { user } = session;
  let bucket;
  let storageId;
  try {
    const requestLimit = MAX_DOCUMENT_BYTES + 1024 * 1024;
    const contentLength = Number(req.headers.get("content-length"));
    if (contentLength > requestLimit) return NextResponse.json({ error: DOCUMENT_UPLOAD_HELP }, { status: 413 });
    let form;
    let oversized = false;
    let received = 0;
    const boundedBody = req.body?.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        received += chunk.byteLength;
        if (received > requestLimit) {
          oversized = true;
          throw new Error("Document request is too large.");
        }
        controller.enqueue(chunk);
      },
    }));
    try {
      form = await new Response(boundedBody || null, { headers: { "Content-Type": req.headers.get("content-type") || "" } }).formData();
    } catch {
      return NextResponse.json({ error: oversized ? DOCUMENT_UPLOAD_HELP : "Choose a document to upload." }, { status: oversized ? 413 : 400 });
    }
    const files = form.getAll("file");
    const file = files[0];
    const requestedUploadId = form.get("uploadId");
    if (requestedUploadId !== null && (typeof requestedUploadId !== "string" || !/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(requestedUploadId))) return NextResponse.json({ error: "Invalid upload request. Choose the file again." }, { status: 400 });
    const uploadId = requestedUploadId?.toLowerCase() || randomUUID();
    if (files.length !== 1 || !file || typeof file.arrayBuffer !== "function" || typeof file.name !== "string") return NextResponse.json({ error: "Upload one document per request." }, { status: 400 });
    if (!validDocumentSize(file.size)) return NextResponse.json({ error: file.size === 0 ? "Empty files cannot be uploaded." : DOCUMENT_UPLOAD_HELP }, { status: file.size > MAX_DOCUMENT_BYTES ? 413 : 400 });
    const name = documentFilename(file.name);
    const bytes = Buffer.from(await file.arrayBuffer());
    const mimeType = documentMime(bytes, name);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    if (!validDocumentSize(bytes.length) || !mimeType) return NextResponse.json({ error: `This document type could not be verified. ${DOCUMENT_UPLOAD_HELP}` }, { status: 400 });
    await connectToDatabase();
    const account = await User.findOne({ _id: user.id, companyId: user.companyId, role: "client", isActive: { $ne: false } }).select("_id").lean();
    if (!account) return NextResponse.json({ error: "Your client account is unavailable." }, { status: 403 });
    const profile = await ClientProfile.findOne({ userId: user.id, companyId: user.companyId }).select("_id userId status documents.uploads").lean();
    if (!profile) return NextResponse.json({ error: "Client profile not found." }, { status: 404 });
    if (profile.status !== "ongoing") return NextResponse.json({ error: "Document uploads are available while your onboarding is in progress.", code: "ONBOARDING_PAUSED" }, { status: 409 });
    const existing = profile.documents?.uploads?.find((upload) => upload.uploadId === uploadId);
    if (existing) {
      if (existing.sha256 !== sha256) return NextResponse.json({ error: "This upload request belongs to another file. Choose your file again.", code: "UPLOAD_CONFLICT" }, { status: 409 });
      return uploadResponse(profile, existing);
    }
    if (req.signal.aborted) return NextResponse.json({ error: "Upload interrupted. Please try again." }, { status: 400 });
    bucket = documentBucket();
    const stream = bucket.openUploadStream(name, { contentType: mimeType, metadata: { companyId: user.companyId, profileId: String(profile._id), userId: user.id, mimeType } });
    storageId = stream.id;
    await new Promise((resolve, reject) => {
      // Finish the bounded GridFS write before cleanup: abort() can reject while
      // GridFS is finalizing, otherwise leaving a late file insert orphaned.
      stream.once("error", reject);
      stream.once("finish", resolve);
      stream.end(bytes);
    });
    if (req.signal.aborted) throw new Error("Upload interrupted before it was saved to the client profile.");
    const upload = { label: name, originalName: name, url: `/api/client-documents/file/${storageId}`, storageId, mimeType, sizeBytes: bytes.length, uploadedAt: new Date(), uploadId, sha256 };
    const updated = await ClientProfile.findOneAndUpdate(
      { _id: profile._id, userId: user.id, companyId: user.companyId, status: "ongoing", "documents.uploads.uploadId": { $ne: uploadId } },
      { $push: { "documents.uploads": upload } },
      { new: true, runValidators: true }
    ).select("_id userId documents.uploads").lean();
    if (!updated) {
      await bucket.delete(storageId);
      storageId = null;
      const latest = await ClientProfile.findOne({ _id: profile._id, userId: user.id, companyId: user.companyId }).select("_id userId documents.uploads").lean();
      const duplicate = latest?.documents?.uploads?.find((document) => document.uploadId === uploadId);
      if (duplicate?.sha256 === sha256) return uploadResponse(latest, duplicate);
      return NextResponse.json({ error: "Your onboarding details changed. Refresh and try again.", code: duplicate ? "UPLOAD_CONFLICT" : "ONBOARDING_PAUSED" }, { status: 409 });
    }
    storageId = null; // The stored file now belongs to a persisted upload record.
    return uploadResponse(updated, upload, 201);
  } catch (error) {
    if (storageId && bucket) await bucket.delete(storageId).catch(() => {});
    console.error("Document upload failed:", error?.message);
    return NextResponse.json({ error: "Unable to upload the document. Please try again." }, { status: 500 });
  }
}
