"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { dashboardConfigs } from "./config";
import { logUIAction } from "@/lib/logUIAction";

import DashboardShell from "./components/dashboardshell/dashboardshell";
import CompaniesPage from "./components/dashboardshell/pages/CompaniesPage";
import SupervisorsPage from "./components/dashboardshell/pages/SupervisorPage";
import UserPage from "./components/dashboardshell/pages/UserPage";
import LogsPage from "./components/dashboardshell/pages/LogsPage";
import ReportsPage from "./components/dashboardshell/pages/ReportsPage";
import NotificationsPage from "./components/dashboardshell/pages/NotificationsPage";
import SettingsPage from "./components/dashboardshell/pages/SettingsPage";
import ProfilePage from "./components/dashboardshell/pages/ProfilePage";
import DemoUsers from "./components/dashboardshell/pages/DemoUsers";
// import DemoRequests from "./components/dashboardshell/pages/DemoRequests";
// import DemoRequests from "./components/dashboardshell/pages/RequestedDemonstration";
import RequestedDemonstration from "./components/dashboardshell/pages/RequestedDemonstration";
import RMsPage from "./components/dashboardshell/pages/RMsPage";
import ClientsPage from "./components/dashboardshell/pages/ClientsPage";
import OnboardingPage from "./components/dashboardshell/pages/OnboardingPage";

const pageMap = {
  dashboard: <div>🏠 Super Admin Dashboard Overview</div>,
  "demo users": <DemoUsers />,
  companies: <CompaniesPage />,
  supervisors: <SupervisorsPage />,
  users: <UserPage />,
  logs: <LogsPage />,
  reports: <ReportsPage />,
  notifications: <NotificationsPage />,
  "system settings": <SettingsPage />,
  profile: <ProfilePage />,
  requesteddemonstration: <RequestedDemonstration />,
  rms: <RMsPage />,
  clients: <ClientsPage />,
  onboarding: <OnboardingPage />,
};

export default function Dashboard() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    if (!user) router.push("/login");
    else {
      // Set default menu based on role
      const config = dashboardConfigs[user.role] || dashboardConfigs.client;
      const firstMenuItem = config?.sidebar?.menu?.[0]?.key || "dashboard";
      if (!activeMenu) {
        setActiveMenu(firstMenuItem);
      }
    }
  }, [user, router, activeMenu]);

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
