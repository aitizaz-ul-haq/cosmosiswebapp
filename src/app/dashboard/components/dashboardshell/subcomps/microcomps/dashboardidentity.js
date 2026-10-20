export function getDisplayName(user) {
  return user?.fullName?.trim() || user?.name?.trim() || user?.username || "My account";
}

export function getDisplayRole(role = "") {
  return { rm: "Relationship Manager", superadmin: "superadmin", supervisor: "supervisor", client: "client" }[role] || role;
}

export function getInitials(user) {
  const words = getDisplayName(user).split(/\s+/).filter(Boolean);
  if (words.length === 1 && words[0].toLowerCase() === "superadmin") return "SA";
  if (words.length > 1) return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  return words[0]?.slice(0, 2).toUpperCase() || "ME";
}

export default function DashboardAvatar({ user, className = "" }) {
  return <span className={`dashboard-avatar ${className}`} aria-hidden="true">{getInitials(user)}</span>;
}
