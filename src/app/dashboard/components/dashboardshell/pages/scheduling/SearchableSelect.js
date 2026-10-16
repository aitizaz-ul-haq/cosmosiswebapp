"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon, ModalField } from "../modalkit/ModalKit";

// Searchable combobox. options: [{ value, label, flag? }]; selected option is held by the parent.
export default function SearchableSelect({
  label,
  icon,
  required,
  hint,
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
  const inputId = useId();
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
    <div ref={ref}>
      <ModalField label={label} required={required} hint={hint} icon={icon} htmlFor={inputId}>
        <input
          id={inputId}
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
        <Icon name="chevronDown" size={18} className="mk-control-trail" />
        {open && !disabled && (
          <ul className="mk-select-list">
            {filtered.length > 0 ? (
              filtered.map((o) => (
                <li
                  key={o.value}
                  className="mk-select-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {o.flag ? <span className="mk-select-flag">{o.flag}</span> : null}
                  <span>{o.label}</span>
                </li>
              ))
            ) : (
              <li className="mk-select-item mk-select-empty">{emptyText}</li>
            )}
          </ul>
        )}
      </ModalField>
    </div>
  );
}
