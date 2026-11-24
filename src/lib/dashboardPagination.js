// Keep list sizes consistent across the Compliance Officer dashboard.
export function getDashboardPageSize(role) {
  return role === "supervisor" ? 10 : 8;
}
