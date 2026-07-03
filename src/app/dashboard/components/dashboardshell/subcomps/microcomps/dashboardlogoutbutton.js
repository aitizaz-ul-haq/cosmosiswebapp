import Image from "next/image";

export default function DashboardLogoutButton({ onLogout }) {
  return (
    <button
      className="dashboard-logout-button"
      onClick={onLogout}
      data-log-title="Logout"
    >
      <Image src="/images/logout.png" width="47" height="47" alt="logout" />
    </button>
  );
}
