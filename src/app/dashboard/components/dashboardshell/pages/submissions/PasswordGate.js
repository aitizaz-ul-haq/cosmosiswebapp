"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalButton, ModalPasswordInput, ModalShell } from "../modalkit/ModalKit";
import "../styles/submissions.css";

// Each protected section mounts a fresh gate; verification is never cached.
export default function PasswordGate({ onVerified }) {
  const descriptionId = useId();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(false);
  const request = useRef(null);
  const dialogRef = useRef(null);
  const returnFocus = useRef(typeof document !== "undefined" ? document.activeElement : null);

  useEffect(() => {
    mounted.current = true;
    const dialog = dialogRef.current;
    const previousFocus = returnFocus.current;
    const main = document.querySelector("main.site-main");
    const previousInert = main?.inert;
    if (main) main.inert = true;
    const focusableElements = () => [...dialog.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')]
      .filter((element) => !element.matches(":disabled") && element.tabIndex >= 0 && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden");
    const focusFirst = () => (focusableElements()[0] || dialog).focus({ preventScroll: true });
    const keepFocusInside = (event) => {
      if (!dialog.contains(event.target)) focusFirst();
    };
    const handleTab = (event) => {
      if (event.key !== "Tab") return;
      const elements = focusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
      } else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab, true);
    document.addEventListener("focusin", keepFocusInside, true);
    if (!dialog.contains(document.activeElement)) focusFirst();
    return () => {
      mounted.current = false;
      request.current?.abort();
      document.removeEventListener("keydown", handleTab, true);
      document.removeEventListener("focusin", keepFocusInside, true);
      if (main) main.inert = previousInert;
      if (previousFocus?.isConnected && !previousFocus.closest("[inert]")) previousFocus.focus({ preventScroll: true });
    };
  }, []);

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
      if (!mounted.current) return;
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

  if (typeof document === "undefined") return null;

  return createPortal(
      <ModalShell
        size="sm"
        icon="lock"
        title="Password required"
        subtitle={<span id={descriptionId}>To access this section, please enter your password.</span>}
        dismissOnOverlay={false}
        overlayClassName="sub-gate-overlay"
        as="form"
        wrapperProps={{ onSubmit: handleSubmit, ref: dialogRef, tabIndex: -1, "aria-busy": submitting, "aria-describedby": descriptionId }}
        footer={
          <ModalButton
            type="submit"
            variant="primary"
            disabled={submitting}
            data-log-title="Section password Enter button clicked"
          >
            {submitting ? "Verifying…" : "Enter"}
          </ModalButton>
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
    document.body
  );
}
