"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useUser } from "@/app/context/UserContext";
import { logUIAction } from "@/lib/logUIAction";
import { formatBytes, safeDocumentUrl } from "@/lib/clientDocuments";
import GenericTable from "./GenericTable";
import PasswordGate from "./submissions/PasswordGate";
import { Icon, ModalButton, ModalShell } from "./modalkit/ModalKit";
import "./styles/submitted-documents.css";

const RASTER_MIME_TYPES = new Set(["image/avif", "image/bmp", "image/gif", "image/jpeg", "image/png", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"]);
const RASTER_EXTENSIONS = new Set(["avif", "bmp", "gif", "ico", "jpeg", "jpg", "png", "webp"]);
const ACTIVE_EXTENSIONS = new Set(["htm", "html", "shtml", "svg", "svgz", "xhtml", "xml", "js", "mjs"]);
const TEXT_PREVIEW_LIMIT = 200000;
const clientName = (client) => client?.fullName || client?.username || "Unavailable client";
const clientId = (client) => String(client?.profileId || client?._id || "");

function storageLabel(client) {
  if (client.unknownSizeCount > 0) {
    return typeof client.knownSizeBytes === "number" && client.knownSizeBytes > 0
      ? `${formatBytes(client.knownSizeBytes)} known · ${client.unknownSizeCount} size${client.unknownSizeCount === 1 ? "" : "s"} unavailable`
      : "Size unavailable";
  }
  return typeof client.totalSizeBytes === "number" ? formatBytes(client.totalSizeBytes) : "Size unavailable";
}

function uploadDate(value) {
  if (!value) return "Upload date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Upload date unavailable" : date.toLocaleString();
}

function fileExtension(value) {
  return /\.([a-z\d]+)$/i.exec(value)?.[1].toLowerCase() || "";
}

function inlinePreviewType(document) {
  const url = safeDocumentUrl(document?.url);
  if (!url) return "unsupported";
  let urlExtension = "";
  try { urlExtension = fileExtension(decodeURIComponent(new URL(url, "https://documents.invalid").pathname)); } catch { /* An unrecognized filename uses the stored type only. */ }
  const nameExtension = fileExtension(document.name || "");
  if (ACTIVE_EXTENSIONS.has(nameExtension) || ACTIVE_EXTENSIONS.has(urlExtension)) return "unsupported";
  const mimeType = String(document.mimeType || "").toLowerCase().split(";", 1)[0].trim();
  const inferFromName = !mimeType || mimeType === "application/octet-stream";
  const extension = nameExtension || urlExtension;
  if (document.previewType === "pdf" && (mimeType === "application/pdf" || (inferFromName && extension === "pdf"))) return "pdf";
  if (document.previewType === "image" && (RASTER_MIME_TYPES.has(mimeType) || (inferFromName && RASTER_EXTENSIONS.has(extension)))) return "image";
  if (document.previewType === "text" && (mimeType === "text/plain" || (inferFromName && extension === "txt"))) return "text";
  return "unsupported";
}

function restoreReviewFocus(trigger) {
  const replacement = trigger?.dataset.documentClientId
    ? [...document.querySelectorAll('[data-document-client-id]')].find((element) => element.dataset.documentClientId === trigger.dataset.documentClientId)
    : null;
  const target = trigger?.isConnected ? trigger : replacement || document.querySelector('.submitted-documents-page input[type="search"]');
  target?.focus();
}

function TextDocumentPreview({ url }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [truncated, setTruncated] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    setText("");
    setTruncated(false);
    const load = async () => {
      try {
        const sameOrigin = new URL(url, window.location.origin).origin === window.location.origin;
        const response = await fetch(url, { signal: controller.signal, credentials: sameOrigin ? "include" : "omit", cache: "no-store" });
        if (!response.ok) throw new Error("Preview unavailable");
        const content = await response.text();
        if (!controller.signal.aborted) {
          setText(content.slice(0, TEXT_PREVIEW_LIMIT));
          setTruncated(content.length > TEXT_PREVIEW_LIMIT);
        }
      } catch (error) {
        if (error?.name !== "AbortError") setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [url]);
  if (loading) return <p className="submitted-documents-preview-message" role="status">Loading document…</p>;
  if (failed) return <p className="submitted-documents-preview-message" role="status">This document could not be previewed. Use Open Document to view it in a new tab.</p>;
  return <>
    <pre className="submitted-documents-text-preview" tabIndex={0} aria-label="Document text">{text || "This text document is empty."}</pre>
    {truncated && <p className="submitted-documents-help">The preview shows the first {TEXT_PREVIEW_LIMIT.toLocaleString()} characters. Open Document to read the full file.</p>}
  </>;
}

function DocumentViewerModal({ client, document, onClose }) {
  const [imageFailed, setImageFailed] = useState(false);
  const url = safeDocumentUrl(document.url);
  const preview = inlinePreviewType(document);
  const privatePdf = preview === "pdf" && url?.startsWith("/") && /^\/api\/client-documents\/file\/[a-f\d]{24}$/i.test(new URL(url, "https://documents.invalid").pathname);
  return createPortal(
    <ModalShell
      icon="file"
      title="Document Viewer"
      subtitle={`${clientName(client)} · ${document.name}`}
      size="lg"
      overlayClassName="submitted-documents-overlay submitted-documents-viewer-overlay"
      onClose={onClose}
      closeLogTitle="Close Document Viewer"
      footer={<>
        <ModalButton variant="neutral" onClick={onClose} autoFocus>Back to Documents</ModalButton>
        {url ? <a className="mk-btn mk-btn-primary" href={url} target="_blank" rel="noopener noreferrer" data-log-title="Open submitted document in a new tab"><Icon name="file" size={17} />Open Document</a> : <ModalButton variant="primary" icon="file" disabled>Open Document</ModalButton>}
      </>}
    >
      <div className="submitted-documents-file-meta"><span>{document.mimeType || "File type unavailable"}</span><span>{formatBytes(document.sizeBytes)}</span><span>{uploadDate(document.uploadedAt)}</span></div>
      {!url ? <p className="submitted-documents-notice" role="status">This document is unavailable. Its stored file link is missing or cannot be opened safely.</p>
        : privatePdf ? <div className="submitted-documents-preview"><iframe title={`PDF document: ${document.name}`} src={url} referrerPolicy="no-referrer" tabIndex={-1} /></div>
          : preview === "image" && !imageFailed ? <div className="submitted-documents-preview submitted-documents-image-preview"><Image src={url} alt={document.name || "Submitted document"} width={1200} height={1600} unoptimized onError={() => setImageFailed(true)} referrerPolicy="no-referrer" /></div>
            : preview === "text" ? <TextDocumentPreview url={url} />
              : <p className="submitted-documents-preview-message" role="status">{imageFailed ? "This image could not be previewed." : "An inline preview is not available for this file type."} Use Open Document to view it in a new tab.</p>}
      {url && preview === "pdf" && <p className="submitted-documents-help">If the PDF preview is unavailable, use Open Document to view the file in a new tab.</p>}
    </ModalShell>,
    window.document.body
  );
}

function DocumentReviewModal({ client, selectedId, onSelect, onView, onClose }) {
  const documents = Array.isArray(client.documents) ? client.documents : [];
  const selectedDocument = documents.find((document) => document.id === selectedId);
  const canView = Boolean(safeDocumentUrl(selectedDocument?.url));
  return createPortal(
    <ModalShell
      icon="file"
      title="Review Documents"
      subtitle={clientName(client)}
      size="lg"
      overlayClassName="submitted-documents-overlay submitted-documents-review-overlay"
      onClose={onClose}
      closeLogTitle={`Close document review: ${clientName(client)}`}
      footer={<>
        <ModalButton variant="neutral" onClick={onClose}>Close</ModalButton>
        <ModalButton variant="primary" icon="eye" disabled={!canView} onClick={() => onView(selectedDocument)} data-log-title="View selected submitted document">View Doc</ModalButton>
      </>}
    >
      <div className="submitted-documents-review-summary"><span>{documents.length} document{documents.length === 1 ? "" : "s"} uploaded</span><span>{storageLabel(client)}</span></div>
      <p className="submitted-documents-help" id="submitted-documents-selection-help">Select one document to open it in Document Viewer.</p>
      {documents.length ? <fieldset className="submitted-documents-list" aria-describedby="submitted-documents-selection-help">
        <legend className="submitted-documents-sr-only">Choose a document</legend>
        {documents.map((document, index) => {
          const available = Boolean(safeDocumentUrl(document.url));
          return <label key={document.id} className={`submitted-documents-option${selectedId === document.id ? " is-selected" : ""}`}>
            <input type="radio" name="submittedDocument" value={document.id} checked={selectedId === document.id} onChange={() => onSelect(document.id)} autoFocus={selectedId === document.id || (!selectedId && index === 0)} />
            <span className="submitted-documents-option-icon"><Icon name="file" size={21} /></span>
            <span className="submitted-documents-option-copy"><strong>{document.name || "Unnamed document"}</strong><span>{formatBytes(document.sizeBytes)} · {uploadDate(document.uploadedAt)}</span></span>
            <span className={`submitted-documents-file-status${available ? "" : " is-unavailable"}`}>{available ? "Available" : "Unavailable"}</span>
          </label>;
        })}
      </fieldset> : <p className="submitted-documents-notice">This client has no uploaded documents.</p>}
      {selectedDocument && !canView && <p className="submitted-documents-notice" role="status">The selected document is unavailable. Choose another document to continue.</p>}
    </ModalShell>,
    document.body
  );
}

export default function SubmittedDocumentsPage() {
  const { user } = useUser();
  const identity = `${user?.role || ""}:${user?.companyId || ""}:${user?.id || user?._id || ""}`;
  const [verifiedFor, setVerifiedFor] = useState(null);
  const unlocked = user?.role === "supervisor" && verifiedFor === identity;
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadVersion, setLoadVersion] = useState(0);
  const [reviewId, setReviewId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const returnFocus = useRef(null);
  const reviewClient = unlocked ? clients.find((client) => clientId(client) === reviewId) : null;
  const viewedDocument = reviewClient?.documents?.find((document) => document.id === viewingId);
  const activeModal = reviewedModalKey(reviewClient, viewedDocument);

  useEffect(() => {
    let active = true;
    if (!unlocked) return () => { active = false; };
    setLoading(true);
    setError("");
    setClients([]);
    setReviewId(null);
    setSelectedId(null);
    setViewingId(null);
    const load = async () => {
      try {
        const response = await fetch("/api/client-documents", { credentials: "include", cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Failed to load submitted documents");
        if (active) setClients(Array.isArray(data.clients) ? data.clients : []);
      } catch (failure) {
        if (active) { setClients([]); setError(failure?.message || "Failed to load submitted documents"); }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [unlocked, identity, loadVersion]);

  useEffect(() => {
    if (!activeModal) return;
    const dialog = document.querySelector('.submitted-documents-overlay [role="dialog"]');
    if (!dialog) return;
    const main = document.querySelector("main.site-main");
    const previousInert = main?.inert;
    dialog.tabIndex = -1;
    if (main) main.inert = true;
    const focusables = () => [...dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')]
      .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length && getComputedStyle(element).visibility !== "hidden");
    const focusFirst = () => (focusables()[0] || dialog).focus();
    const keepInside = (event) => { if (!dialog.contains(event.target)) focusFirst(); };
    const trapTab = (event) => {
      if (event.key !== "Tab") return;
      const elements = focusables();
      const first = elements[0], last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); }
      else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trapTab, true);
    document.addEventListener("focusin", keepInside, true);
    if (!dialog.contains(document.activeElement)) focusFirst();
    return () => {
      document.removeEventListener("keydown", trapTab, true);
      document.removeEventListener("focusin", keepInside, true);
      if (main) main.inert = previousInert;
      requestAnimationFrame(() => {
        if (!document.querySelector('.submitted-documents-overlay [role="dialog"]')) restoreReviewFocus(returnFocus.current);
      });
    };
  }, [activeModal]);

  const openReview = (client, event) => {
    returnFocus.current = event.currentTarget;
    setReviewId(clientId(client));
    setSelectedId(null);
    setViewingId(null);
    logUIAction("document_review_opened", { title: `Reviewed submitted documents: ${clientName(client)}`, entityType: "client_documents", clientProfileId: clientId(client), documentCount: client.documentCount });
  };
  const openDocument = (selectedDocument) => {
    if (!selectedDocument || !safeDocumentUrl(selectedDocument.url)) return;
    setViewingId(selectedDocument.id);
    logUIAction("document_viewed", { title: `Viewed submitted document: ${clientName(reviewClient)}`, entityType: "client_document", clientProfileId: clientId(reviewClient), documentId: selectedDocument.id });
  };
  const closeReview = () => { setViewingId(null); setReviewId(null); setSelectedId(null); };
  const columns = [
    { id: "clientName", header: "Client Name", accessorFn: clientName, meta: { showTitle: true }, cell: ({ getValue }) => <span className="submitted-documents-cell">{getValue()}</span> },
    { accessorKey: "documentCount", header: "Documents Uploaded" },
    { id: "storage", header: "Total Storage Used", accessorFn: storageLabel, meta: { showTitle: true }, cell: ({ getValue }) => <span className="submitted-documents-cell">{getValue()}</span> },
    { id: "actions", header: "Actions", cell: ({ row }) => <button type="button" className="management-row-action is-edit" disabled={!row.original.documents?.length} title={row.original.documents?.length ? `Review documents for ${clientName(row.original)}` : "No documents uploaded"} onClick={(event) => openReview(row.original, event)} data-document-client-id={clientId(row.original)} data-log-title={`Review submitted documents: ${clientName(row.original)}`}><Icon name="eye" size={16} />Review</button> },
  ];

  if (user?.role !== "supervisor") return <p className="submitted-documents-notice">Submitted documents are reviewed by your Compliance Officer.</p>;
  return <>
    <div className="submitted-documents-protected" aria-hidden={!unlocked} inert={!unlocked ? "" : undefined}>
      {unlocked && error && <div className="submitted-documents-load-error"><p role="alert">{error}</p><ModalButton icon="clock" onClick={() => setLoadVersion((value) => value + 1)} data-log-title="Retry submitted documents">Retry</ModalButton></div>}
      <GenericTable title="Submitted Documents" description="Review your clients’ uploaded documents and the storage they use." className="submitted-documents-page" data={unlocked ? clients : []} columns={columns} filterableFields={["clientName", "documentCount", "storage"]} loading={unlocked && loading} disableRowModal />
    </div>
    {!unlocked && <PasswordGate onVerified={() => setVerifiedFor(identity)} />}
    {reviewClient && !viewedDocument && <DocumentReviewModal client={reviewClient} selectedId={selectedId} onSelect={setSelectedId} onView={openDocument} onClose={closeReview} />}
    {reviewClient && viewedDocument && <DocumentViewerModal key={viewedDocument.id} client={reviewClient} document={viewedDocument} onClose={() => setViewingId(null)} />}
  </>;
}

function reviewedModalKey(client, document) {
  return client ? `${clientId(client)}:${document ? document.id : "review"}` : null;
}
