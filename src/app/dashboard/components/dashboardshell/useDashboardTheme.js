"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cosmosis-dashboard-theme";

export default function useDashboardTheme() {
  const [theme, setTheme] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setTheme(window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light");
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
    setReady(true);

    const syncPreference = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setTheme(event.newValue === "dark" ? "dark" : "light");
      }
    };
    window.addEventListener("storage", syncPreference);
    return () => {
      window.removeEventListener("storage", syncPreference);
      delete document.documentElement.dataset.dashboardTheme;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.dashboardTheme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The active theme does not depend on being able to save the preference.
    }
  }, [ready, theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => current === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggleTheme };
}
