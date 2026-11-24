const DOCUMENT_BASE_URL = "https://documents.invalid";
const RASTER_MIME_TYPES = new Set([
  "image/avif", "image/bmp", "image/gif", "image/jpeg", "image/png", "image/webp",
  "image/x-icon", "image/vnd.microsoft.icon",
]);
const RASTER_EXTENSIONS = new Set(["avif", "bmp", "gif", "ico", "jpeg", "jpg", "png", "webp"]);
const ACTIVE_EXTENSIONS = new Set(["htm", "html", "shtml", "svg", "svgz", "xhtml", "xml"]);

export function safeDocumentUrl(raw) {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value || /[\\\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    if (value.startsWith("/") && !value.startsWith("//")) {
      const url = new URL(value, DOCUMENT_BASE_URL);
      return url.origin === DOCUMENT_BASE_URL && !url.pathname.startsWith("//") ? `${url.pathname}${url.search}${url.hash}` : null;
    }
    if (!/^https?:\/\//i.test(value)) return null;
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

function documentSize(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export function formatBytes(bytes) {
  const value = documentSize(bytes);
  if (value === null) return "Unknown size";
  if (value === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const unit = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const amount = Number((value / 1024 ** unit).toFixed(unit === 0 ? 0 : 2));
  return `${amount} ${units[unit]}`;
}

function cleanText(value) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "").trim() : "";
}

function originalFilename(value) {
  return cleanText(value).split(/[\\/]/).pop() || "";
}

function filenameFromUrl(url) {
  if (!url) return "";
  try {
    const filename = new URL(url, DOCUMENT_BASE_URL).pathname.split("/").pop();
    return originalFilename(decodeURIComponent(filename || ""));
  } catch {
    return "";
  }
}

function extension(value) {
  return /\.([a-z\d]+)$/i.exec(value)?.[1].toLowerCase() || "";
}

function previewType(mimeType, name, url) {
  if (!url) return "unsupported";
  const nameExtension = extension(name);
  const urlExtension = extension(filenameFromUrl(url));
  if (ACTIVE_EXTENSIONS.has(nameExtension) || ACTIVE_EXTENSIONS.has(urlExtension)) return "unsupported";
  if (mimeType === "application/pdf") return "pdf";
  if (RASTER_MIME_TYPES.has(mimeType)) return "image";
  if (mimeType === "text/plain") return "text";
  if (mimeType && mimeType !== "application/octet-stream") return "unsupported";
  const inferredExtension = nameExtension || urlExtension;
  if (inferredExtension === "pdf") return "pdf";
  if (inferredExtension === "txt") return "text";
  return RASTER_EXTENSIONS.has(inferredExtension) ? "image" : "unsupported";
}

function uploadedDate(value) {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

export function normalizeClientDocuments(profile) {
  const profileId = profile?._id ? String(profile._id) : "";
  const user = profile?.userId;
  const contact = user && typeof user === "object" ? user : null;
  const userId = contact?._id ? String(contact._id) : user ? String(user) : null;
  const uploads = Array.isArray(profile?.documents?.uploads) ? profile.documents.uploads : [];
  const documents = uploads.flatMap((upload, index) => {
    if (!upload || typeof upload.url !== "string" || !upload.url.trim()) return [];
    const url = safeDocumentUrl(upload.url);
    const name = originalFilename(upload.originalName) || cleanText(upload.label) || filenameFromUrl(url) || `Document ${index + 1}`;
    const mimeType = cleanText(upload.mimeType).split(";", 1)[0].trim().toLowerCase();
    return [{
      id: `${profileId}:document:${index}`,
      name,
      url,
      mimeType,
      sizeBytes: documentSize(upload.sizeBytes),
      uploadedAt: uploadedDate(upload.uploadedAt),
      previewType: previewType(mimeType, name, url),
    }];
  });
  const unknownSizeCount = documents.filter((document) => document.sizeBytes === null).length;
  const knownTotal = documents.reduce((total, document) => total + (document.sizeBytes ?? 0), 0);
  const knownSizeBytes = Number.isSafeInteger(knownTotal) ? knownTotal : null;
  const username = cleanText(contact?.username);
  return {
    _id: profileId,
    profileId,
    userId,
    fullName: cleanText(contact?.fullName) || username || "Unavailable client",
    username,
    documentCount: documents.length,
    totalSizeBytes: unknownSizeCount === 0 ? knownSizeBytes : null,
    knownSizeBytes,
    unknownSizeCount,
    documents,
  };
}
