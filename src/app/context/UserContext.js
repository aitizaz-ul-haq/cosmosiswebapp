"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { id, username, role, companyId }
  const [loading, setLoading] = useState(true); // show loader on refresh

  // 🔑 login function calls backend API
  async function login(username, password) {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // ✅ ensures cookies are sent/received
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login error:", data.error);
        return null;
      }

      // Fetch full user data including companyId from /api/me
      const meRes = await fetch("/api/me", { credentials: "include" });
      const meData = await meRes.json();

      if (meRes.ok && meData.success) {
        setUser(meData.user); // { id, username, role, companyId }
      } else {
        setUser({
          username,
          role: data.role,
        });
      }

      return data;
    } catch (err) {
      console.error("Login failed:", err);
      return null;
    }
  }

  // 🔓 logout clears state + cookie
  async function logout() {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Unable to clear the session");
    }
    setUser(null);
  }

  // 🌀 check if user is already logged in on refresh
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (!active) return;

        if (res.ok && data.success) {
          setUser(data.user); // ✅ user: { id, username, role, companyId }
        } else {
          setUser(null);
        }
      } catch (err) {
        if (!active) return;
        console.error("Auto-login error:", err);
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
