"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import SuperAdminDashboard from "./components/superadmindashboard/superadmindashboard";
import SupervisorDashboard from "./components/supervisordashboard/supervisordashboard";
import RmDashboard from "./components/rmdashboard/rmdashboard";
import ClientDashboard from "./components/clientdashboard/clientdashboard";

export default function Dashboard() {
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <h1>Welcome, {user.username} 👋</h1>
      <p>Your role: {user.role}</p>

      {user.role === "superadmin" && <SuperAdminDashboard />}
      {user.role === "supervisor" && <SupervisorDashboard />}
      {user.role === "rm" && <RmDashboard />}
      {user.role === "client" && <ClientDashboard />}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Log Out
      </button>
    </div>
  );
}
