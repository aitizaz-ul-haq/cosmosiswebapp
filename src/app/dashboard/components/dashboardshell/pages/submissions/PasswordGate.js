"use client";

import { useState } from "react";
import { ModalButton, ModalPasswordInput, ModalShell } from "../modalkit/ModalKit";
import "../styles/submissions.css";

// Blurs the whole page until the logged-in user re-enters their password.
export default function PasswordGate({ onVerified }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setError(data?.error || "Incorrect password");
        setSubmitting(false);
        return;
      }
      onVerified();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="sub-gate-overlay">
      <ModalShell
        size="sm"
        icon="lock"
        title="To access this section please enter your password here"
        dismissOnOverlay={false}
        as="form"
        wrapperProps={{ onSubmit: handleSubmit }}
        footer={
          <ModalButton
            type="submit"
            variant="primary"
            disabled={submitting}
            data-log-title="Submissions password Enter button clicked"
          >
            {submitting ? "Verifying…" : "Enter"}
          </ModalButton>
        }
      >
        <ModalPasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
          autoFocus
          error={error}
        />
      </ModalShell>
    </div>
  );
}
