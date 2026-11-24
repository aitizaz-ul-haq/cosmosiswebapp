// Keep persisted role codes stable for existing users, sessions and API clients.
// Human-readable designations belong at the presentation boundary.
export const ROLE_LABELS = Object.freeze({
  superadmin: "Superadmin",
  supervisor: "Compliance Officer",
  rm: "Investment Manager",
  client: "Client",
  other: "Other",
});

export function getRoleLabel(role = "") {
  const value = String(role ?? "");
  const key = value.trim().toLowerCase();
  if (Object.hasOwn(ROLE_LABELS, key)) return ROLE_LABELS[key];
  if (/^(?:relationship|relations)\s+manager$/i.test(key)) return ROLE_LABELS.rm;
  return value;
}

// Historical audit titles can contain the previous designations. Format their
// display without rewriting the underlying audit records or metadata.
export function formatRoleText(text = "") {
  return String(text ?? "")
    .replace(/\b(?:relationship|relations)\s+managers\b|\bRMs\b/gi, "Investment Managers")
    .replace(/\b(?:relationship|relations)\s+manager\b|\bRM\b/gi, "Investment Manager")
    .replace(/\bsupervisors\b/gi, "Compliance Officers")
    .replace(/\bsupervisor\b/gi, "Compliance Officer");
}
