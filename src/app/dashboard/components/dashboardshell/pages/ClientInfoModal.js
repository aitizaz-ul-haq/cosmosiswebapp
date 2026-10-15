"use client";

import {
  STATUS_LABELS,
  onboardingTypeLabel,
  modalOverlayStyle,
  modalCardStyle,
} from "./clientStatusShared";

export default function ClientInfoModal({ client, onClose, footerActions }) {
  if (!client) return null;

  const rows = [
    { label: "Full name", value: client.fullName },
    { label: "Email", value: client.email },
    { label: "Phone", value: client.phone },
    { label: "Status", value: STATUS_LABELS[client.status] || client.status },
    { label: "Onboarding type", value: onboardingTypeLabel(client.onboardingType) },
    { label: "RM name", value: client.assignedToName },
    { label: "Shared with", value: (client.sharedWithNames || []).join(", ") },
    { label: "Assigned by", value: client.assignedByName },
    { label: "RM remarks", value: client.rmRemarks },
    {
      label: "Created",
      value: client.createdAt ? new Date(client.createdAt).toLocaleString() : "",
    },
  ];

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={modalCardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
            {client.fullName || "Client details"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-log-title={`Close Client Info modal: ${client.fullName || client.email}`}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
              lineHeight: 1,
              cursor: "pointer",
              color: "#6D7692",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          {rows.map((item) => (
            <div
              key={item.label}
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: "0.5rem",
                padding: "0.5rem 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <span style={{ fontWeight: 600, color: "#6D7692" }}>{item.label}</span>
              <span style={{ color: "#1a1a1a", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                {item.value || "—"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.25rem" }}>
          {footerActions || (
            <button
              type="button"
              onClick={onClose}
              data-log-title={`Close Client Info modal: ${client.fullName || client.email}`}
              style={{
                padding: "0.5rem 1rem",
                fontWeight: 700,
                borderRadius: "0.5rem",
                backgroundColor: "var(--btn-green-light)",
                border: "1px solid var(--btn-green-light)",
                color: "#fff",
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
