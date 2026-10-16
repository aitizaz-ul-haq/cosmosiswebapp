"use client";

import { useState } from "react";
import { ModalButton, ModalPasswordInput, ModalShell } from "./modalkit/ModalKit";

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
    <ModalShell
      size="sm"
      icon="trash"
      iconTone="red"
      title={`Do you want to delete ${itemLabel}?`}
      subtitle="Enter your password to confirm this action."
      onClose={handleCancel}
      overlayClassName="mk-overlay-top"
      as="form"
      wrapperProps={{ onSubmit: handleSubmit }}
      footer={
        <>
          <ModalButton variant="neutral" onClick={handleCancel} disabled={submitting}>
            Cancel
          </ModalButton>
          <ModalButton
            type="submit"
            variant="danger"
            icon="trash"
            disabled={submitting}
            data-log-title={`Confirmed delete: ${itemLabel}`}
          >
            {submitting ? "Verifying…" : "Delete"}
          </ModalButton>
        </>
      }
    >
      <ModalPasswordInput
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        aria-label="Your password"
        error={error}
      />
    </ModalShell>
  );
}
