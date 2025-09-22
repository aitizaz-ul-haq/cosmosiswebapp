"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell from "./components/dashboardshell/dashboardshell";
import { dashboardConfigs } from "./config";
import { logUIAction } from "@/lib/logUIAction";

import CompaniesPage from "./components/dashboardshell/pages/CompaniesPage";
import SupervisorsPage from "./components/dashboardshell/pages/SupervisorPage";
import UserPage from "./components/dashboardshell/pages/UserPage";
import LogsPage from "./components/dashboardshell/pages/LogsPage";
import ReportsPage from "./components/dashboardshell/pages/ReportsPage";
import NotificationsPage from "./components/dashboardshell/pages/NotificationsPage";
import SettingsPage from "./components/dashboardshell/pages/SettingsPage";
import ProfilePage from "./components/dashboardshell/pages/ProfilePage";

const pageMap = {
  dashboard: <div>🏠 Super Admin Dashboard Overview</div>,
  companies: <CompaniesPage />,
  supervisors: <SupervisorsPage />,
  users: <UserPage />,
  logs: <LogsPage />,
  reports: <ReportsPage />,
  notifications: <NotificationsPage />,
  "system settings": <SettingsPage />,
  profile: <ProfilePage />,
};

export default function Dashboard() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  const handleLogout = async () => {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "logout",
        metadata: { username: user.username },
      }),
      credentials: "include",
    });
    await logUIAction("logout", { username: user.username });
    logout();
    router.push("/login");
  };

  const config = dashboardConfigs[user.role] || dashboardConfigs.client;

  return (
    <DashboardShell
      config={config}
      onLogout={handleLogout}
      user={user}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      {pageMap[activeMenu] || <div>Welcome {user.role}!</div>}
    </DashboardShell>
  );
}
