"use client";

import { useState } from "react";
import DashboardSidebarLogoContainer from "./microcomps/dashboardsidebarlogocontainer";
import DashboardSidebarMenuContainer from "./microcomps/dashboardsidebarmenucontainer";

export default function DashboardSideBarSection({
  config,
  user,
  activeMenu,
  setActiveMenu,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`dashboard-sidebar-section ${collapsed ? "collapsed" : ""}`}>
      <button
        type="button"
        className="dashboard-sidebar-toggle"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        data-log-title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span className="dashboard-sidebar-toggle-icon" />
      </button>

      <DashboardSidebarLogoContainer user={user} collapsed={collapsed} />
      <DashboardSidebarMenuContainer
        config={config}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        collapsed={collapsed}
      />
    </div>
  );
}
