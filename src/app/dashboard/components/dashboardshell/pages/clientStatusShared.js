"use client";

export const STATUS_LABELS = {
  approval_pending: "Approval pending",
  register: "Register",
  ongoing: "Ongoing",
  on_hold: "On hold",
  cancelled: "Cancelled",
};

export const STATUS_COLORS = {
  approval_pending: { bg: "#E0E7FF", text: "#3730A3", border: "#A5B4FC" },
  register: { bg: "#CCFBF1", text: "#115E59", border: "#5EEAD4" },
  ongoing: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
  on_hold: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
};

export const ONBOARDING_TYPE_OPTIONS = [
  { value: "individual", label: "Individual" },
  { value: "joint", label: "Joint" },
  { value: "corporate", label: "Corporate" },
  { value: "trust", label: "Trust" },
];

export const onboardingTypeLabel = (value) =>
  ONBOARDING_TYPE_OPTIONS.find((o) => o.value === value)?.label || value || "—";

export const actionBtnStyle = {
  padding: "0.4rem 0.75rem",
  textAlign: "center",
  fontWeight: 700,
  borderRadius: "0.5rem",
};

export const modalFieldStyle = {
  padding: "0.5rem 0.75rem",
  fontSize: "1rem",
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: "6px",
};

export const modalActionBtnStyle = {
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "6px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  fontSize: "1rem",
  color: "#fff",
};

export const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

export const modalCardStyle = {
  background: "#fff",
  width: "min(640px, 92vw)",
  maxHeight: "85vh",
  overflowY: "auto",
  borderRadius: "12px",
  padding: "1.5rem",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  textAlign: "left",
};

export function ClientStatusBadge({ status }) {
  const value = status || "ongoing";
  const c = STATUS_COLORS[value] || STATUS_COLORS.ongoing;
  return (
    <span
      style={{
        display: "inline-block",
        textAlign: "center",
        padding: "0.2rem 0.7rem",
        borderRadius: "999px",
        fontWeight: 600,
        fontSize: "0.8rem",
        lineHeight: 1.3,
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {STATUS_LABELS[value] || value}
    </span>
  );
}
