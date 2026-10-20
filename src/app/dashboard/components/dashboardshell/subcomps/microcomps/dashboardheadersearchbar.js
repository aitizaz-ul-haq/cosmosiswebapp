"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import DashboardShellIcon from "./dashboardshellicon";

export default function DashboardHeaderSearchBar({ config, setActiveMenu }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const menuItems = config?.sidebar?.menu || [];
    return menuItems.filter((item) => item.label.toLowerCase().includes(term) || item.key.toLowerCase().includes(term));
  }, [query, config]);

  useEffect(() => {
    const close = (event) => { if (!containerRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const select = (item) => { setActiveMenu?.(item.key); setQuery(""); setOpen(false); };

  return (
    <div className="dashboard-header-search" ref={containerRef}>
      <DashboardShellIcon name="search" size={21} className="dashboard-search-icon" />
      <input type="search" className="dashboard-header-search-input" placeholder={config?.header?.searchPlaceholder || "Search dashboard..."} aria-label="Search dashboard pages" aria-controls={open && query.trim() ? "dashboard-search-results" : undefined} value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" && results.length) select(results[0]); if (event.key === "Escape") setOpen(false); }} />
      {open && query.trim() && <ul className="dashboard-header-search-results" id="dashboard-search-results">
        {results.length ? results.map((item) => <li key={item.key}><button type="button" className="dashboard-header-search-result-item" data-log-title={`Search result: ${item.label}`} onClick={() => select(item)}><DashboardShellIcon name={item.key} size={18}/><span>{item.label}</span></button></li>) : <li className="dashboard-header-search-no-result">No results found</li>}
      </ul>}
    </div>
  );
}
