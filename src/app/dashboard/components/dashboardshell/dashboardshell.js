"use client";

import "./styles/dashboardshell.css";

import DashboardSideBarSection from "./subcomps/dashboardsidebarsection";
import DashboardDetailsSection from "./subcomps/dashboarddetailssection";

export default function DashboardShell({
  config,
  onLogout,
  user,
  activeMenu,
  setActiveMenu,
  children,
}) {
  return (
    <div className="dashboard-container">
      {/* Sidebar Section */}
      <DashboardSideBarSection
        config={config}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      {/* Main Section */}
      <DashboardDetailsSection
        onLogout={onLogout}
        user={user}
        children={children}
      />
    </div>
  );
}
