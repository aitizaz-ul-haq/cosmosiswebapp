import DashboardHeaderSearchBar from "./microcomps/dashboardheadersearchbar";
import DashboardHeaderIconButton from "./microcomps/dashboardheadericonbutton";

export default function DashboardHeaderSection({
  onLogout,
  config,
  setActiveMenu,
}) {
  return (
    <div className="dasboard-header-section">
      {/* Left: Search bar */}
      <DashboardHeaderSearchBar
        config={config}
        setActiveMenu={setActiveMenu}
      />

      {/* Right: Action icons */}
      <div className="dashboard-header-actions">
        <DashboardHeaderIconButton
          src="/images/bell.png"
          alt="notifications"
          tooltip="Notifications"
          dataLogTitle="Notifications"
        />
        <DashboardHeaderIconButton
          src="/images/settings.png"
          alt="settings"
          tooltip="Settings"
          dataLogTitle="Settings"
          onClick={() => setActiveMenu?.("profile")}
        />
        <DashboardHeaderIconButton
          src="/images/signout.png"
          alt="sign out"
          tooltip="Sign Out"
          dataLogTitle="Logout"
          onClick={onLogout}
        />
      </div>
    </div>
  );
}
