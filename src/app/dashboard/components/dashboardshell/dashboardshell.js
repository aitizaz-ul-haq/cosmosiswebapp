"use client";

import { useEffect, useState } from "react";
import "./styles/dashboardshell.css";
import DashboardSideBarSection from "./subcomps/dashboardsidebarsection";
import DashboardDetailsSection from "./subcomps/dashboarddetailssection";

export default function DashboardShell({ config, onLogout, user, activeMenu, setActiveMenu, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = (menu) => { setActiveMenu?.(menu); setMobileOpen(false); };

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event) => { if (event.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <div className={`dashboard-container${collapsed ? " sidebar-is-collapsed" : ""}`} data-role={user?.role}>
      {mobileOpen && <button type="button" className="dashboard-sidebar-backdrop" data-log-title="Close navigation" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <DashboardSideBarSection config={config} user={user} activeMenu={activeMenu} setActiveMenu={navigate} onLogout={onLogout} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <DashboardDetailsSection onLogout={onLogout} user={user} config={config} activeMenu={activeMenu} setActiveMenu={navigate} mobileOpen={mobileOpen} onOpenMobile={() => setMobileOpen(true)}>{children}</DashboardDetailsSection>
    </div>
  );
}
