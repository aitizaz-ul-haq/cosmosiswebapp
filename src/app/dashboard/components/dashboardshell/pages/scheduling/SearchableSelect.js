"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { modalFieldStyle } from "../clientStatusShared";

const listStyle = {
  position: "absolute",
  zIndex: 20,
  top: "100%",
  left: 0,
  right: 0,
  maxHeight: "220px",
  overflowY: "auto",
  margin: "0.25rem 0 0",
  padding: 0,
  listStyle: "none",
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.45rem 0.7rem",
  cursor: "pointer",
  fontSize: "0.9rem",
};

// Searchable combobox. options: [{ value, label, flag? }]; selected option is held by the parent.
export default function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  emptyText = "No results",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || null;

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    return t ? options.filter((o) => o.label.toLowerCase().includes(t)) : options;
  }, [options, query]);

  const shown = open ? query : selected ? `${selected.flag ? `${selected.flag} ` : ""}${selected.label}` : "";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
        {label}
        <input
          style={modalFieldStyle}
          type="text"
          value={shown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
      </label>
      {open && !disabled && (
        <ul style={listStyle}>
          {filtered.length > 0 ? (
            filtered.map((o) => (
              <li
                key={o.value}
                style={itemStyle}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {o.flag ? <span style={{ fontSize: "1.1rem" }}>{o.flag}</span> : null}
                <span>{o.label}</span>
              </li>
            ))
          ) : (
            <li style={{ ...itemStyle, color: "#9ca3af", cursor: "default" }}>{emptyText}</li>
          )}
        </ul>
      )}
    </div>
  );
}
