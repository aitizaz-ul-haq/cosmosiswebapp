// src/app/dashboard/page.js
"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell from "./components/dashboardshell/dashboardshell";
import { dashboardConfigs } from "./config";
import { logUIAction } from "@/lib/logUIAction";

export default function Dashboard() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  const handleLogout = async () => {
    // ✅ Log logout before clearing state
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
    ></DashboardShell>
  );
}
