"use client";

import { useEffect, useRef, useState } from "react";
import DashboardHeaderSearchBar from "./microcomps/dashboardheadersearchbar";
import DashboardAccountMenu from "./microcomps/dashboardaccountmenu";
import DashboardShellIcon from "./microcomps/dashboardshellicon";

export default function DashboardHeaderSection({ onLogout, user, config, setActiveMenu, mobileOpen, onOpenMobile }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);
  useEffect(() => {
    if (!notificationsOpen) return;
    const dismiss = (event) => {
      if (event.key === "Escape" || (event.type === "pointerdown" && !notificationsRef.current?.contains(event.target))) setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", dismiss); };
  }, [notificationsOpen]);

  return (
    <header className="dasboard-header-section">
      <button type="button" className="dashboard-mobile-menu-button dashboard-header-icon-button" data-log-title="Open navigation" onClick={onOpenMobile} aria-label="Open navigation" aria-controls="dashboard-sidebar" aria-expanded={mobileOpen}><DashboardShellIcon name="menu" /></button>
      <DashboardHeaderSearchBar config={config} setActiveMenu={setActiveMenu} />
      <div className="dashboard-header-actions">
        <div className="dashboard-header-notifications" ref={notificationsRef}>
          <button type="button" className="dashboard-header-icon-button" aria-label="Notifications" aria-expanded={notificationsOpen} aria-controls="dashboard-notifications-popover" onClick={() => setNotificationsOpen((value) => !value)} data-log-title="Notifications"><DashboardShellIcon name="notifications" /><span className="dashboard-notification-dot" /></button>
          {notificationsOpen && <div id="dashboard-notifications-popover" className="dashboard-notifications-popover"><strong>Notifications</strong>{user?.role === "rm" ? <button type="button" className="dashboard-notifications-link" data-log-title="View recent client activity" onClick={() => { setActiveMenu?.("notifications"); setNotificationsOpen(false); }}>View recent client activity</button> : <p>Your account notifications will appear here.</p>}</div>}
        </div>
        <button type="button" className="dashboard-header-icon-button" aria-label="Profile settings" title="Profile settings" onClick={() => setActiveMenu?.("profile")} data-log-title="Settings"><DashboardShellIcon name="settings" /></button>
        <span className="dashboard-header-divider" />
        <DashboardAccountMenu user={user} onLogout={onLogout} setActiveMenu={setActiveMenu} />
      </div>
    </header>
  );
}
