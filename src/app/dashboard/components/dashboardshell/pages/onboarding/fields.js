"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "./countries";

// Reusable form primitives for the individual onboarding form.
// Inputs are uncontrolled (use `name` for future serialization) to keep the
// large form readable. Radios/checkboxes rely on `name` grouping.

// ---- Inline icon set (24x24 viewBox, stroke = currentColor) ------------
const ICONS = {
  user: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0" />,
  home: <path d="M3 10l9-7 9 7M5 9v11h14V9" />,
  pin: (
    <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  ),
  calendar: (
    <path d="M7 3v3m10-3v3M4 8h16M5 6h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z" />
  ),
  globe: (
    <path d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-18c2.5 2.5 3.8 6 3.8 9S14.5 18.5 12 21m0-18C9.5 5.5 8.2 9 8.2 12S9.5 18.5 12 21M3.2 9h17.6M3.2 15h17.6" />
  ),
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a12 12 0 006 6L16 13l5 2v3a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z" />
  ),
  mail: <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 1l8 6 8-6" />,
  id: (
    <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm10 4h5M14 12h5M14 15h3M8.5 12a2 2 0 100-4 2 2 0 000 4zm-3 4a3 3 0 016 0" />
  ),
  building: (
    <path d="M4 21V4a1 1 0 011-1h10a1 1 0 011 1v17M16 8h3a1 1 0 011 1v12M7 7h2M7 11h2M7 15h2M12 7h1M12 11h1M12 15h1" />
  ),
  heart: (
    <path d="M12 20s-7-4.5-9.2-9A4.5 4.5 0 0112 5a4.5 4.5 0 019.2 6c-2.2 4.5-9.2 9-9.2 9z" />
  ),
  badge: (
    <path d="M9 3h6l1 3h3a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h3l1-3zm3 9a2 2 0 100-4 2 2 0 000 4zm-3.5 5a3.5 3.5 0 017 0" />
  ),
};

export function FieldIcon({ name }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      className="onb-field-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

function HelpIcon({ text }) {
  if (!text) return null;
  return (
    <span
      className="onb-help"
      tabIndex={0}
      role="img"
      aria-label={text}
      data-help={text}
    >
      ?
    </span>
  );
}

function LabelRow({ label, name, icon, help }) {
  if (!label) return null;
  return (
    <div className="onb-field-labelrow">
      <label htmlFor={name} className="onb-field-label">
        {icon && <FieldIcon name={icon} />}
        <span>{label}</span>
      </label>
      <HelpIcon text={help} />
    </div>
  );
}

export function SectionTitle({ children }) {
  return <h3 className="onb-section-title">{children}</h3>;
}

export function Note({ children }) {
  return <p className="onb-note">{children}</p>;
}

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  icon,
  help,
}) {
  const [error, setError] = useState("");

  // Telephone: allow only digits and a single leading +, no fixed pattern.
  const handleTelInput = (e) => {
    let v = e.target.value.replace(/[^\d+]/g, "");
    v = v.replace(/(?!^)\+/g, "");
    e.target.value = v;
  };

  const handleEmailBlur = (e) => {
    const v = e.target.value.trim();
    if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const isTel = type === "tel";
  const isEmail = type === "email";

  return (
    <div className="onb-field">
      <LabelRow label={label} name={name} icon={icon} help={help} />
      <input
        id={name}
        name={name}
        type={isTel ? "text" : type}
        inputMode={isTel ? "tel" : undefined}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onInput={isTel ? handleTelInput : undefined}
        onBlur={isEmail ? handleEmailBlur : undefined}
        className={error ? "onb-input-error" : undefined}
      />
      {error && <span className="onb-field-error">{error}</span>}
    </div>
  );
}

export function TextArea({ label, name, rows = 3, placeholder, icon, help, half }) {
  return (
    <div className={`onb-field${half ? " onb-field-half" : ""}`}>
      <LabelRow label={label} name={name} icon={icon} help={help} />
      <textarea id={name} name={name} rows={rows} placeholder={placeholder} />
    </div>
  );
}

export function SelectField({
  label,
  name,
  options = [],
  defaultValue = "",
  icon,
  help,
}) {
  return (
    <div className="onb-field">
      <LabelRow label={label} name={name} icon={icon} help={help} />
      <select id={name} name={name} defaultValue={defaultValue}>
        <option value="">Select…</option>
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const text = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
}

// Searchable country combobox with flags. Only the country name is stored
// (in a hidden input) so downstream serialization saves the plain name.
export function CountrySelect({
  label,
  name,
  icon = "globe",
  help,
  placeholder = "Search and select a country…",
  defaultValue = "",
}) {
  const [query, setQuery] = useState(defaultValue);
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t || t === selected.toLowerCase()) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(t));
  }, [query, selected]);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const choose = (c) => {
    setSelected(c.name);
    setQuery(c.name);
    setOpen(false);
  };

  return (
    <div className="onb-field" ref={ref}>
      <LabelRow label={label} name={name} icon={icon} help={help} />
      <div className="onb-combo">
        <input
          type="text"
          className="onb-input onb-combo-input"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected("");
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {/* Only the plain country name is persisted */}
        <input type="hidden" name={name} value={selected} />
        {open && (
          <ul className="onb-combo-list">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <li
                  key={c.code}
                  className="onb-combo-item"
                  onClick={() => choose(c)}
                >
                  <span className="onb-flag">{c.flag}</span>
                  <span>{c.name}</span>
                </li>
              ))
            ) : (
              <li className="onb-combo-empty">No countries found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

// A group of radio options (single choice) or checkboxes (multi choice).
export function ChoiceGroup({
  label,
  name,
  options = [],
  type = "radio",
  stacked = false,
  size,
  icon,
  help,
}) {
  return (
    <div className="onb-field">
      {label && <LabelRow label={label} name={name} icon={icon} help={help} />}
      <div
        className={`onb-choice-group${stacked ? " stacked" : ""}${
          size === "lg" ? " onb-choice-group-lg" : ""
        }`}
      >
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const text = typeof opt === "string" ? opt : opt.label;
          return (
            <label className="onb-choice" key={value}>
              <input type={type} name={name} value={value} />
              <span>{text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// A single checkbox row.
export function CheckRow({ label, name, big }) {
  return (
    <label className={`onb-choice${big ? " onb-choice-big" : ""}`}>
      <input type="checkbox" name={name} value="yes" />
      <span>{label}</span>
    </label>
  );
}

// Inline Yes / No radio pair.
export function YesNo({ label, name, icon, help }) {
  return (
    <div className="onb-field">
      {label && <LabelRow label={label} name={name} icon={icon} help={help} />}
      <div className="onb-yesno">
        <label className="onb-choice">
          <input type="radio" name={name} value="yes" />
          <span>Yes</span>
        </label>
        <label className="onb-choice">
          <input type="radio" name={name} value="no" />
          <span>No</span>
        </label>
      </div>
    </div>
  );
}
