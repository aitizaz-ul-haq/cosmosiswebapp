"use client";

export const STATUS_LABELS = {
  approval_pending: "Approval pending",
  under_review: "Under review",
  register: "Register",
  ongoing: "In progress",
  on_hold: "On hold",
  cancelled: "Cancelled",
};

export const STATUS_COLORS = {
  approval_pending: { bg: "#E0E7FF", text: "#3730A3", border: "#A5B4FC" },
  under_review: { bg: "#F3E8FF", text: "#6B21A8", border: "#D8B4FE" },
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

// The individual onboarding form's 6 phases and the progress % reached at each.
export const PHASE_CONFIG = [
  { phase: 1, pct: 20, name: "Personal Details" },
  { phase: 2, pct: 35, name: "Source of Wealth" },
  { phase: 3, pct: 50, name: "Financial Profile" },
  { phase: 4, pct: 65, name: "Risk Profile" },
  { phase: 5, pct: 80, name: "Signature" },
  { phase: 6, pct: 100, name: "Documentation Checklist" },
];

export const getPhaseConfig = (client) => {
  const step = Number(client?.onboarding?.currentStep) || 1;
  return PHASE_CONFIG[Math.min(Math.max(step, 1), PHASE_CONFIG.length) - 1];
};

// Section headings inside each phase of the onboarding form, keyed by phase number.
export const PHASE_SECTIONS = {
  0: ["Charges & Regulatory Information", "Terms & Conditions"],
  1: [
    "Account Holders",
    "National Client Identifier (NCI)",
    "Non-US Person Status Declaration",
    "Investment Services",
    "External Advisers",
    "Daily News Wrap-Up",
  ],
  2: ["Source of Wealth"],
  3: [
    "Purpose of the Portfolio",
    "Employment Status",
    "Assets",
    "Liabilities",
    "Net Worth & Proposed Investment",
    "Annual Income",
    "Annual Expenditure",
    "Financial Dependents",
    "Knowledge & Experience",
  ],
  4: ["Risk Questionnaire", "Investment Strategy", "Non-Standard Investments"],
  5: ["Signatures"],
  6: ["Documentation Checklist"],
};

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
