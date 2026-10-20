"use client";

import { useEffect, useRef, useState } from "react";
import DashboardAvatar, { getDisplayName, getDisplayRole } from "./dashboardidentity";
import DashboardShellIcon from "./dashboardshellicon";

export default function DashboardAccountMenu({ user, onLogout, setActiveMenu, sidebar = false, collapsed = false }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const select = (action) => { setOpen(false); action?.(); };

  return (
    <div ref={containerRef} className={`dashboard-account${sidebar ? " dashboard-sidebar-account" : ""}${collapsed ? " is-collapsed" : ""}`}>
      <button ref={triggerRef} type="button" className="dashboard-account-trigger" onClick={() => setOpen((value) => !value)} aria-label={`Account options for ${getDisplayName(user)}`} aria-expanded={open} aria-haspopup="true" data-log-title="Account menu">
        <DashboardAvatar user={user} />
        <span className="dashboard-account-identity"><span className="dashboard-account-name">{getDisplayName(user)}</span>{sidebar && <span className="dashboard-account-role">{getDisplayRole(user?.role)}</span>}</span>
        <DashboardShellIcon name="chevron" size={18} className="dashboard-account-chevron" />
      </button>
      {open && <div className="dashboard-account-dropdown">
        <p className="dashboard-account-dropdown-title">{getDisplayName(user)}</p>
        <button type="button" onClick={() => select(() => setActiveMenu?.("profile"))} data-log-title="Profile"><DashboardShellIcon name="profile" size={18} />My Profile</button>
        <button type="button" onClick={() => select(onLogout)} data-log-title="Logout"><DashboardShellIcon name="logout" size={18} />Log Out</button>
      </div>}
    </div>
  );
}
