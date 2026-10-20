"use client";

import DashboardSidebarLogoContainer from "./microcomps/dashboardsidebarlogocontainer";
import DashboardSidebarMenuContainer from "./microcomps/dashboardsidebarmenucontainer";
import DashboardShellIcon from "./microcomps/dashboardshellicon";

export default function DashboardSideBarSection({ config, user, activeMenu, setActiveMenu, onLogout, collapsed, onToggle, mobileOpen, onCloseMobile }) {
  return (
    <aside id="dashboard-sidebar" className={`dashboard-sidebar-section${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}>
      <button type="button" className="dashboard-sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} data-log-title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
        <DashboardShellIcon name="left" size={17} />
      </button>
      <button type="button" className="dashboard-sidebar-mobile-close" data-log-title="Close navigation" onClick={onCloseMobile} aria-label="Close navigation"><DashboardShellIcon name="close" /></button>
      <DashboardSidebarLogoContainer user={user} collapsed={collapsed} onLogout={onLogout} setActiveMenu={setActiveMenu} />
      <DashboardSidebarMenuContainer config={config} activeMenu={activeMenu} setActiveMenu={setActiveMenu} collapsed={collapsed} />
      <div className="dashboard-sidebar-footer"><strong>Cosmosis</strong><span>Client Onboarding Platform</span></div>
    </aside>
  );
}
