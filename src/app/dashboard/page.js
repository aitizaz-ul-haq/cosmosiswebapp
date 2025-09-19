// src/app/dashboard/page.js
"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell from "./components/dashboardshell/dashboardshell";
import { dashboardConfigs } from "./config";

export default function Dashboard() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const config = dashboardConfigs[user.role] || dashboardConfigs.client;

  return (
    <DashboardShell config={config} onLogout={handleLogout}>
      <h1>Welcome, {user.username} 👋</h1>
      <p>Role: {user.role}</p>

      {/* You can later add role-based main content */}
      <div>Main dashboard content for {user.role}</div>
    </DashboardShell>
  );
}
