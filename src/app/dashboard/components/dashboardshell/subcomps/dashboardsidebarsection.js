import DashboardSidebarLogoContainer from "./microcomps/dashboardsidebarlogocontainer";
import DashboardSidebarMenuContainer from "./microcomps/dashboardsidebarmenucontainer";

export default function DashboardSideBarSection({
  config,
  activeMenu,
  setActiveMenu,
}) {
  return (
    <div className="dashboard-sidebar-section">
      <DashboardSidebarLogoContainer />
      <DashboardSidebarMenuContainer
        config={config}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
    </div>
  );
}
