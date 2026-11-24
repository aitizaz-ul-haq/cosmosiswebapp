import mongoose from "mongoose";
import { verifyToken } from "@/lib/auth";
import { MAX_DOCUMENT_BYTES } from "@/lib/documentUploadRules";

export function documentSession(req, roles) {
  const user = verifyToken(req);
  if (!user) return { status: 401, error: "Unauthorized" };
  const isId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
  if (!roles.includes(user.role) || !isId(user.id) || !isId(user.companyId)) {
    return { status: 403, error: "Forbidden" };
  }
  return { user: { ...user, id: user.id.toLowerCase(), companyId: user.companyId.toLowerCase() } };
}

export function documentBucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "onboardingDocuments" });
}

export function documentFilename(raw) {
  const filename = String(raw || "").split(/[\\/]/).pop()
    .replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "").trim();
  const extension = /\.[a-z\d]+$/i.exec(filename)?.[0] || "";
  return filename.length > 180 ? filename.slice(0, 180 - extension.length) + extension : filename;
}

// MIME is determined from the bytes and extension, never from the browser's claim.
export function documentMime(bytes, filename) {
  const extension = /\.([a-z\d]+)$/i.exec(filename)?.[1].toLowerCase();
  if (extension === "pdf" && bytes.subarray(0, 5).toString() === "%PDF-") return "application/pdf";
  if (extension === "png" && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (["jpg", "jpeg"].includes(extension) && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
  if (extension === "gif" && ["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString())) return "image/gif";
  if (extension === "webp" && bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP") return "image/webp";
  if (extension === "txt") {
    try {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) return "text/plain";
    } catch { /* Invalid UTF-8 is not a text upload. */ }
  }
  return null;
}

export function validDocumentSize(size) {
  return Number.isSafeInteger(size) && size > 0 && size <= MAX_DOCUMENT_BYTES;
}

export function documentRange(header, length) {
  if (!Number.isSafeInteger(length) || length <= 0) return null;
  if (!header) return { start: 0, end: length - 1, partial: false };
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return null;
  let start = match[1] ? Number(match[1]) : Math.max(0, length - Number(match[2]));
  let end = match[1] && match[2] ? Number(match[2]) : length - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= length || end < start) return null;
  if (!match[1] && Number(match[2]) <= 0) return null;
  end = Math.min(end, length - 1);
  return { start, end, partial: true };
}
