import DashboardLogoutButton from "./microcomps/dashboardlogoutbutton";

export default function DashboardHeaderSection({ onLogout }) {
  return (
    <div className="dasboard-header-section">
      <div />
      <DashboardLogoutButton onLogout={onLogout} />
    </div>
  );
}
