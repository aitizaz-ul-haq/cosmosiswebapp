"use client";

// Reusable form primitives for the individual onboarding form.
// Inputs are uncontrolled (use `name` for future serialization) to keep the
// large form readable. Radios/checkboxes rely on `name` grouping.

export function SectionTitle({ children }) {
  return <h3 className="onb-section-title">{children}</h3>;
}

export function Note({ children }) {
  return <p className="onb-note">{children}</p>;
}

export function Field({ label, name, type = "text", placeholder, defaultValue }) {
  return (
    <div className="onb-field">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export function TextArea({ label, name, rows = 3, placeholder }) {
  return (
    <div className="onb-field">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea id={name} name={name} rows={rows} placeholder={placeholder} />
    </div>
  );
}

export function SelectField({ label, name, options = [], defaultValue = "" }) {
  return (
    <div className="onb-field">
      {label && <label htmlFor={name}>{label}</label>}
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

// A group of radio options (single choice) or checkboxes (multi choice).
export function ChoiceGroup({
  label,
  name,
  options = [],
  type = "radio",
  stacked = false,
}) {
  return (
    <div className="onb-field">
      {label && <span className="onb-label">{label}</span>}
      <div className={`onb-choice-group${stacked ? " stacked" : ""}`}>
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
export function CheckRow({ label, name }) {
  return (
    <label className="onb-choice">
      <input type="checkbox" name={name} value="yes" />
      <span>{label}</span>
    </label>
  );
}

// Inline Yes / No radio pair.
export function YesNo({ label, name }) {
  return (
    <div className="onb-field">
      {label && <span className="onb-label">{label}</span>}
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
