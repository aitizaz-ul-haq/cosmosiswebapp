"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout } = useUser(); // ✅ include logout
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  const handleLogout = () => {
    logout();              // clear user state
    router.push("/login"); // redirect to login
  };

  return (
    <div>
      <h1>Welcome, {user.username} 👋</h1>
      <p>Your role: {user.role}</p>

      {user.role === "admin" && <p>Admin dashboard content</p>}
      {user.role === "supervisor" && <p>Supervisor dashboard content</p>}
      {user.role === "rm" && <p>Relationship Manager dashboard content</p>}
      {user.role === "client" && <p>Client dashboard content</p>}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Log Out
      </button>
    </div>
  );
}
