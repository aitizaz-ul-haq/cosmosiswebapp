// src/app/dashboard/DashboardShell.js
"use client";

import Image from "next/image";

import "./styles/dashboardshell.css";

export default function DashboardShell({ config, onLogout, children, user }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar-section">
        <div className="dashboard-sidebar-logo-container">
          <Image
            src="/images/sidebarlogo.png"
            width="209"
            height="108"
            title="cosmosis logo"
          />
        </div>
        <div className="dashboard-sidebar-menu-container">
          {/* <ul> */}
          {config.sidebar.menu.map((item) => (
            <div className="menu-options" key={item.key}>
              {item.label}
            </div>
          ))}
          {/* </ul> */}
        </div>
      </div>
      <div className="dashboard-details-section">
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
              title="logout"
              alt="logout button"
            />
          </button>
        </div>
        <div className="dashboard-menus-section">{children}</div>
      </div>
    </div>
  );
}
