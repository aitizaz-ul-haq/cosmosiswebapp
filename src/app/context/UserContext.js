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

      // Store all user info from backend (/api/login sets JWT in cookie)
      setUser({
        username,
        role: data.role,
      });

      return data;
    } catch (err) {
      console.error("Login failed:", err);
      return null;
    }
  }

  // 🔓 logout clears state + cookie
  async function logout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  }

  // 🌀 check if user is already logged in on refresh
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user); // ✅ user: { id, username, role, companyId }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auto-login error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
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
