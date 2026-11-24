"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { formatBytes, safeDocumentUrl } from "@/lib/clientDocuments";
import { DOCUMENT_FILE_ACCEPT, DOCUMENT_UPLOAD_HELP, MAX_DOCUMENT_BYTES } from "@/lib/documentUploadRules";
import { logUIAction } from "@/lib/logUIAction";
import Icon from "../modalkit/Icon";
import "./document-uploads.css";

export default function ClientDocumentUploads() {
  const { user } = useUser();
  const identity = `${user?.id || user?._id || ""}:${user?.companyId || ""}`;
  const identityRef = useRef(identity);
  identityRef.current = identity;
  const [documents, setDocuments] = useState([]);
  const [loadedFor, setLoadedFor] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [canUpload, setCanUpload] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [reload, setReload] = useState(0);
  const inputRef = useRef(null);
  const uploadController = useRef(null);
  const busy = useRef(false);
  const operation = useRef(0);
  const uploadIds = useRef(new WeakMap());

  useEffect(() => {
    if (user?.role !== "client") return;
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setDocuments([]);
    setCanUpload(false);
    setLoadError("");
    setSelectedFiles([]);
    setUploading(false);
    setStatusMessage("");
    setUploadError("");
    setProgress(0);
    setUploadTotal(0);
    setAvailabilityMessage("");
    const load = async () => {
      try {
        const response = await fetch("/api/client-documents/mine", { credentials: "include", cache: "no-store", signal: controller.signal });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Unable to load your documents.");
        if (!active) return;
        setDocuments(Array.isArray(data.documents) ? data.documents : []);
        setCanUpload(data.canUpload === true);
        setAvailabilityMessage(data.message || "");
        setLoadedFor(identity);
      } catch (error) {
        if (active && error.name !== "AbortError") setLoadError(error.message || "Unable to load your documents.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
      controller.abort();
      uploadController.current?.abort();
      operation.current += 1;
      busy.current = false;
    };
  }, [identity, user?.role, reload]);

  const chooseFiles = (event) => {
    const files = Array.from(event.target.files || []);
    const extensions = DOCUMENT_FILE_ACCEPT.split(",");
    const invalid = files.find((file) => file.size <= 0 || file.size > MAX_DOCUMENT_BYTES || !extensions.some((extension) => file.name.toLowerCase().endsWith(extension)));
    setStatusMessage("");
    setUploadError(invalid ? `Please choose a supported, nonempty file: ${invalid.name}. ${DOCUMENT_UPLOAD_HELP}` : "");
    setSelectedFiles(invalid ? [] : files);
    if (invalid) event.target.value = "";
  };

  const uploadFiles = async (event) => {
    event.preventDefault();
    if (busy.current || !selectedFiles.length || !canUpload || loadedFor !== identity) return;
    const currentOperation = ++operation.current;
    const owner = identity;
    const files = [...selectedFiles];
    const remaining = [...files];
    const controller = new AbortController();
    uploadController.current = controller;
    const isCurrent = () => currentOperation === operation.current && identityRef.current === owner;
    busy.current = true;
    setUploading(true);
    setUploadError("");
    setStatusMessage("");
    setProgress(0);
    setUploadTotal(files.length);
    let uploaded = 0;
    try {
      for (let index = 0; index < files.length; index += 1) {
        if (!isCurrent()) return;
        setProgress(index + 1);
        const body = new FormData();
        body.append("file", files[index]);
        if (!uploadIds.current.has(files[index])) uploadIds.current.set(files[index], crypto.randomUUID());
        body.append("uploadId", uploadIds.current.get(files[index]));
        const response = await fetch("/api/client-documents/upload", { method: "POST", credentials: "include", body, signal: controller.signal });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !Array.isArray(data.documents)) {
          if (isCurrent() && response.status === 409 && data.code === "ONBOARDING_PAUSED") {
            setCanUpload(false);
            setAvailabilityMessage(data.error || "Refresh to check your onboarding status.");
          }
          throw new Error(data.error || "Unable to upload this document. Please try again.");
        }
        remaining.shift();
        uploaded += 1;
        if (!isCurrent()) return;
        setDocuments(data.documents);
        setSelectedFiles([...remaining]);
        logUIAction("document_uploaded", { title: `Uploaded onboarding document: ${files[index].name}`, entityType: "document", entity: { id: data.document?.id || null, name: data.document?.name || files[index].name, sizeBytes: data.document?.sizeBytes ?? files[index].size } });
      }
      if (isCurrent()) {
        setStatusMessage(`${uploaded} document${uploaded === 1 ? "" : "s"} uploaded successfully.`);
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch (error) {
      if (isCurrent() && error.name !== "AbortError") {
        setSelectedFiles(remaining);
        setUploadError(`${uploaded ? `${uploaded} document${uploaded === 1 ? "" : "s"} saved. ` : ""}${error.message || "Upload failed. Please try again."}`);
      }
    } finally {
      if (isCurrent()) {
        busy.current = false;
        setUploading(false);
        uploadController.current = null;
      }
    }
  };

  if (user?.role !== "client") return null;
  const visibleDocuments = loadedFor === identity ? documents : [];
  const unknownSize = visibleDocuments.some((document) => document.sizeBytes === null || document.sizeBytes === undefined);
  const totalBytes = visibleDocuments.reduce((total, document) => total + (document.sizeBytes || 0), 0);

  return (
    <section className="onb-document-uploads" aria-labelledby="onboarding-upload-heading" aria-busy={loading || uploading}>
      <div className="onb-upload-heading">
        <span className="onb-upload-icon"><Icon name="file" size={20} /></span>
        <div><h3 id="onboarding-upload-heading">Upload Documents</h3><p>Upload the documents requested in your checklist. {DOCUMENT_UPLOAD_HELP}</p></div>
      </div>
      {loading ? <p role="status">Loading your documents…</p> : loadError ? (
        <div><p className="onb-upload-error" role="alert">{loadError}</p><button type="button" className="onb-modal-btn neutral" onClick={() => setReload((value) => value + 1)}>Retry</button></div>
      ) : (
        <>
          {!canUpload && <p className="onb-upload-notice">{availabilityMessage || "Document uploads are currently unavailable."}</p>}
          <form onSubmit={uploadFiles} className="onb-upload-form">
            <label htmlFor="onboarding-document-files">Choose documents</label>
            <input ref={inputRef} id="onboarding-document-files" name="files" type="file" accept={DOCUMENT_FILE_ACCEPT} multiple disabled={uploading || !canUpload || loadedFor !== identity} onChange={chooseFiles} />
            {selectedFiles.length > 0 && <ul className="onb-upload-selection">{selectedFiles.map((file, index) => <li key={`${file.name}:${index}`}><span>{file.name}</span><span>{formatBytes(file.size)}</span></li>)}</ul>}
            {uploadError && <p className="onb-upload-error" role="alert">{uploadError}</p>}
            <div className="onb-upload-submit"><button type="submit" className="onb-modal-btn primary" disabled={uploading || !canUpload || !selectedFiles.length || loadedFor !== identity} data-log-title="Upload onboarding documents">{uploading ? `Uploading ${progress} of ${uploadTotal}…` : "Upload Documents"}</button><span role="status" aria-live="polite">{statusMessage}</span></div>
          </form>
          <div className="onb-uploaded-heading"><h4>Uploaded Documents ({visibleDocuments.length})</h4><span>Storage used: {unknownSize ? "Some file sizes are unavailable" : formatBytes(totalBytes)}</span></div>
          {visibleDocuments.length ? <ul className="onb-uploaded-list">{visibleDocuments.map((document) => {
            const href = safeDocumentUrl(document.url);
            return <li key={document.id}><span><strong>{document.name}</strong><small>{formatBytes(document.sizeBytes)}</small></span>{href ? <a href={href} target="_blank" rel="noopener noreferrer" data-log-title={`Open own document: ${document.name}`}>Open Document</a> : <span>File unavailable</span>}</li>;
          })}</ul> : <p className="onb-upload-empty">No documents uploaded yet.</p>}
        </>
      )}
    </section>
  );
}
