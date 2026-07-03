"use client";

import { useState } from "react";

/**
 * Reusable password-verified delete confirmation modal.
 *
 * Props:
 * - open: boolean — whether the modal is visible
 * - itemLabel: string — what is being deleted, e.g. "this client"
 * - onCancel: () => void — called when the user cancels/closes
 * - onConfirm: () => Promise<void> | void — called ONLY after the password is verified
 */
export default function DeleteConfirmModal({
  open,
  itemLabel = "this item",
  onCancel,
  onConfirm,
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const reset = () => {
    setPassword("");
    setError("");
    setSubmitting(false);
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await onConfirm?.();
      reset();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
      }}
      onClick={handleCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "min(420px, 92vw)",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.15rem", fontWeight: 700 }}>
          Do you want to delete {itemLabel}?
        </h3>
        <p style={{ margin: "0 0 1rem", color: "#6D7692", fontSize: "0.9rem" }}>
          Enter your password to confirm this action.
        </p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "0.95rem",
            marginBottom: "0.5rem",
            boxSizing: "border-box",
          }}
        />

        {error ? (
          <p style={{ color: "#dc2626", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>
            {error}
          </p>
        ) : null}

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            marginTop: "0.75rem",
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="dash-action-btn dash-btn-neutral"
            style={{
              padding: "0.5rem 1.1rem",
              fontWeight: 700,
              borderRadius: "0.5rem",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            data-log-title={`Confirmed delete: ${itemLabel}`}
            className="dash-action-btn dash-btn-danger"
            style={{
              padding: "0.5rem 1.1rem",
              fontWeight: 700,
              borderRadius: "0.5rem",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Verifying…" : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
}
