// src/app/dashboard/DashboardShell.js
"use client";

import Image from "next/image";
import "./styles/dashboardshell.css";

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
      {/* Sidebar */}
      <div className="dashboard-sidebar-section">
        <div className="dashboard-sidebar-logo-container">
          <Image
            src="/images/sidebarlogo.png"
            width="209"
            height="108"
            alt="cosmosis logo"
            title="cosmosis logo"
          />
        </div>

        <div className="dashboard-sidebar-menu-container">
          {config.sidebar.menu.map((item) => (
            <div
              className={`menu-options ${
                activeMenu === item.key ? "active" : ""
              }`}
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
            >
              <Image
                src={item.iconlink}
                width="32"
                height="32"
                title={item.label}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
      {/* Main Section */}
      <div className="dashboard-details-section">
        {/* Header Section */}
        <div className="dasboard-header-section">
          <div className="dashboard-header-text-conatiner">
            <h1 className="dashboard-header-heading">{user.username}</h1>
            <p>{user.role}</p>
          </div>
          <button className="dashboard-logout-button" onClick={onLogout}>
            <Image
              src="/images/logout.png"
              width="47"
              height="47"
              alt="logout"
            />
          </button>
        </div>
        {/* Main Section */}
        <div className="dashboard-menus-section">{children}</div>
      </div>
    </div>
  );
}
