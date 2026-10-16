"use client";

import { useState } from "react";
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
      <form
        className="sub-gate-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sub-gate-title"
        onSubmit={handleSubmit}
      >
        <h3 id="sub-gate-title" className="sub-gate-title">
          To access this section please enter your password here
        </h3>
        <input
          type="password"
          className="sub-gate-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          autoFocus
        />
        {error ? <div className="sub-gate-error">{error}</div> : null}
        <button
          type="submit"
          className="sub-gate-btn"
          disabled={submitting}
          data-log-title="Submissions password Enter button clicked"
        >
          {submitting ? "Verifying…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
