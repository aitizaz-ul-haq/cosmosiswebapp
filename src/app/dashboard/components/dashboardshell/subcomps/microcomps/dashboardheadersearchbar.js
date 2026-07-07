"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function DashboardHeaderSearchBar({ config, setActiveMenu }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const menuItems = config?.sidebar?.menu || [];

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return menuItems.filter(
      (item) =>
        item.label.toLowerCase().includes(term) ||
        item.key.toLowerCase().includes(term)
    );
  }, [query, menuItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setActiveMenu?.(item.key);
    setQuery("");
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="dashboard-header-search" ref={containerRef}>
      <input
        type="text"
        className="dashboard-header-search-input"
        placeholder="Search..."
        aria-label="Search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {open && query.trim() && (
        <ul className="dashboard-header-search-results">
          {results.length > 0 ? (
            results.map((item) => (
              <li
                key={item.key}
                className="dashboard-header-search-result-item"
                onClick={() => handleSelect(item)}
              >
                {item.iconlink && (
                  <Image
                    src={item.iconlink}
                    width={18}
                    height={18}
                    alt={item.label}
                  />
                )}
                <span>{item.label}</span>
              </li>
            ))
          ) : (
            <li className="dashboard-header-search-no-result">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
