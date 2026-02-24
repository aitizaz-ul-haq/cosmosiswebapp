import Image from "next/image";

function toTitleCase(value = "") {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getDisplayRole(role = "") {
  if (role === "rm") return "Relationship Manager";
  return role;
}

export default function DashboardSidebarLogoContainer({ user }) {
  const displayName = toTitleCase(user?.fullName || user?.username || "");
  const displayRole = getDisplayRole(user?.role || "");

  return (
    <div className="dashboard-sidebar-logo-container">
      <Image
        src="/images/sidebarlogo.png"
        width="209"
        height="108"
        alt="cosmosis logo"
        title="cosmosis logo"
      />
      <div className="dashboard-sidebar-user-info">
        <p className="dashboard-sidebar-user-name">{displayName}</p>
        <p className="dashboard-sidebar-user-role">{displayRole}</p>
      </div>
    </div>
  );
}
