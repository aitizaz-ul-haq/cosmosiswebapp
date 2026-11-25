"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalButton, ModalPasswordInput, ModalShell } from "../modalkit/ModalKit";
import "../styles/submissions.css";

// Each protected section mounts a fresh gate; verification is never cached.
export default function PasswordGate({ onVerified, onCancel, sectionLabel = "this section" }) {
  const descriptionId = useId();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(false);
  const request = useRef(null);
  const dialogRef = useRef(null);
  const anchorRef = useRef(null);
  const [portalTarget, setPortalTarget] = useState(null);
  const returnFocus = useRef(typeof document !== "undefined" ? document.activeElement : null);

  useEffect(() => {
    setPortalTarget(anchorRef.current?.closest(".dashboard-page-view") || anchorRef.current?.parentElement);
  }, []);

  useEffect(() => {
    if (!portalTarget) return undefined;
    mounted.current = true;
    const dialog = dialogRef.current;
    const previousFocus = returnFocus.current;
    // This dialog belongs to the content page; sidebar/header navigation stays available.
    if (!dialog.closest("[inert]")) dialog.querySelector("input")?.focus({ preventScroll: true });
    return () => {
      mounted.current = false;
      request.current?.abort();
      if (previousFocus?.isConnected && !previousFocus.closest("[inert]")) previousFocus.focus({ preventScroll: true });
    };
  }, [portalTarget]);

  const handleCancel = () => {
    request.current?.abort();
    setPassword("");
    onCancel?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending.current) return;
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    pending.current = true;
    setSubmitting(true);
    setError("");
    const controller = new AbortController();
    request.current = controller;
    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!mounted.current || controller.signal.aborted) return;
      if (!res.ok || !data?.success) {
        setError(data?.error || "Incorrect password");
        return;
      }
      setPassword("");
      onVerified?.();
    } catch (err) {
      if (mounted.current && err?.name !== "AbortError") setError("Something went wrong. Please try again.");
    } finally {
      pending.current = false;
      if (request.current === controller) request.current = null;
      if (mounted.current) {
        setSubmitting(false);
        requestAnimationFrame(() => dialogRef.current?.querySelector("input")?.focus({ preventScroll: true }));
      }
    }
  };

  return <>
    <span ref={anchorRef} hidden />
    {portalTarget && createPortal(
      <ModalShell
        size="sm"
        icon="lock"
        title="Password required"
        subtitle={<span id={descriptionId}>To access {sectionLabel}, please enter your password.</span>}
        onClose={onCancel ? handleCancel : undefined}
        closeLogTitle="Cancel section password and return to Dashboard"
        dismissOnOverlay={false}
        overlayClassName="sub-gate-overlay"
        as="form"
        wrapperProps={{ onSubmit: handleSubmit, ref: dialogRef, tabIndex: -1, "aria-busy": submitting, "aria-describedby": descriptionId, "aria-modal": false }}
        footer={
          <>
          <ModalButton type="button" variant="neutral" onClick={handleCancel} data-log-title="Cancel section password and return to Dashboard">Cancel</ModalButton>
          <ModalButton
            type="submit"
            variant="primary"
            disabled={submitting}
            data-log-title="Section password Enter button clicked"
          >
            {submitting ? "Verifying…" : "Enter"}
          </ModalButton>
          </>
        }
      >
        <fieldset className="sub-gate-fields" disabled={submitting} aria-live="polite">
          <ModalPasswordInput
            label="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            aria-invalid={Boolean(error)}
            autoComplete="current-password"
            autoFocus
            disabled={submitting}
            error={error}
          />
        </fieldset>
      </ModalShell>,
    portalTarget
    )}
  </>;
}
