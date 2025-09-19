// src/app/dashboard/DashboardShell.js
"use client";

export default function DashboardShell({ config, onLogout, children, user }) {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">{config.header.logoText}</div>
        <button onClick={onLogout}>Logout</button>
      </header>

      {/* Layout */}
      <div className="dashboard-body">
        <h1>Welcome, {user.username} 👋</h1>
        <p>Role: {user.role}</p>

        {/* You can later add role-based main content */}
        <div>Main dashboard content for {user.role}</div>
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <ul>
            {config.sidebar.menu.map((item) => (
              <li key={item.key}>{item.label}</li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
