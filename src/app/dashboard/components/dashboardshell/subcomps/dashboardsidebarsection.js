import DashboardSidebarLogoContainer from "./microcomps/dashboardsidebarlogocontainer";
import DashboardSidebarMenuContainer from "./microcomps/dashboardsidebarmenucontainer";

export default function DashboardSideBarSection({
  config,
  user,
  activeMenu,
  setActiveMenu,
}) {
  return (
    <div className="dashboard-sidebar-section">
      <DashboardSidebarLogoContainer user={user} />
      <DashboardSidebarMenuContainer
        config={config}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
    </div>
  );
}
