import DashboardHeaderTextContainer from "./microcomps/dashboardheadertxtcontainer";
import DashboardLogoutButton from "./microcomps/dashboardlogoutbutton";

export default function DashboardHeaderSection({ onLogout, user }) {
  return (
    <div className="dasboard-header-section">
      <DashboardHeaderTextContainer user={user} />
      <DashboardLogoutButton onLogout={onLogout} />
    </div>
  );
}
