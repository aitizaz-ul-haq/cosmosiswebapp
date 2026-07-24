"use client";

import { useUser } from "../context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { dashboardConfigs } from "./config";
import { logUIAction } from "@/lib/logUIAction";

import DashboardShell from "./components/dashboardshell/dashboardshell";
import ActionLogger from "./components/ActionLogger";
import CompaniesPage from "./components/dashboardshell/pages/CompaniesPage";
import SupervisorsPage from "./components/dashboardshell/pages/SupervisorPage";
import UserPage from "./components/dashboardshell/pages/UserPage";
import LogsPage from "./components/dashboardshell/pages/LogsPage";
import ReportsPage from "./components/dashboardshell/pages/ReportsPage";
import SubmissionsPage from "./components/dashboardshell/pages/SubmissionsPage";
import ProfilePage from "./components/dashboardshell/pages/ProfilePage";
import RMsPage from "./components/dashboardshell/pages/RMsPage";
import ClientsPage from "./components/dashboardshell/pages/ClientsPage";
import OnboardingPage from "./components/dashboardshell/pages/OnboardingPage";
import SupervisorDashboard from "./components/dashboardshell/pages/SupervisorDashboard";
import RMDashboard from "./components/dashboardshell/pages/RMDashboard";
import SuperAdminDashboard from "./components/dashboardshell/pages/SuperAdminDashboard";

// import NotificationsPage from "./components/dashboardshell/pages/NotificationsPage";
// import SettingsPage from "./components/dashboardshell/pages/SettingsPage";
// import DemoUsers from "./components/dashboardshell/pages/DemoUsers";
// import DemoRequests from "./components/dashboardshell/pages/DemoRequests";
// import DemoRequests from "./components/dashboardshell/pages/RequestedDemonstration";
// import RequestedDemonstration from "./components/dashboardshell/pages/RequestedDemonstration";

const getPageMap = (userRole) => {
  const baseMap = {
    // "demo users": <DemoUsers />,
    // notifications: <NotificationsPage />,
    // "system settings": <SettingsPage />,
    // requesteddemonstration: <RequestedDemonstration />,
    companies: <CompaniesPage />,
    supervisors: <SupervisorsPage />,
    users: <UserPage />,
    logs: <LogsPage />,
    reports: <ReportsPage />,
    submissions: <SubmissionsPage />,
    profile: <ProfilePage />,
    rms: <RMsPage />,
    clients: <ClientsPage />,
    onboarding: <OnboardingPage />,
    progress: <div className="dashboard-empty-page"></div>,
    onboardingstatus: <div className="dashboard-empty-page"></div>,
  };

  // Role-based dashboard override
  if (userRole === "superadmin") {
    return {
      ...baseMap,
      dashboard: <SuperAdminDashboard />,
    };
  }

  if (userRole === "supervisor") {
    return {
      ...baseMap,
      dashboard: <SupervisorDashboard />,
    };
  }

  if (userRole === "rm") {
    return {
      ...baseMap,
      dashboard: <RMDashboard />,
    };
  }

  return {
    ...baseMap,
    dashboard: <div>🏠 Super Admin Dashboard Overview</div>,
  };
};

export default function Dashboard() {
  const { user, logout, loading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    // Wait for the auto-login check to finish before deciding to redirect.
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const config = dashboardConfigs[user.role] || dashboardConfigs.client;
    const menuParam = searchParams?.get("menu");
    const menuKeys = config?.sidebar?.menu?.map((item) => item.key) || [];

    if (menuParam && menuKeys.includes(menuParam)) {
      setActiveMenu(menuParam);
      router.replace("/dashboard");
      return;
    }

    // Set default menu based on role
    const firstMenuItem = config?.sidebar?.menu?.[0]?.key || "dashboard";
    if (!activeMenu) {
      setActiveMenu(firstMenuItem);
    }
  }, [user, router, activeMenu, searchParams, loading]);

  if (loading || !user) return <p>Loading...</p>;

  const handleLogout = async () => {
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
      {/* 🔒 Tracks every button/menu interaction in the dashboard for the audit log */}
      <ActionLogger context="dashboard" />
      {getPageMap(user.role)[activeMenu] || <div>Welcome {user.role}!</div>}
    </DashboardShell>
  );
}
