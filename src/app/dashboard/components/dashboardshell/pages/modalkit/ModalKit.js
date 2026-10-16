"use client";

/*
 * MODAL KIT - the standard look for every dashboard modal.
 *
 * Design rules (taken from the example_modal_1..5 designs in /public/images):
 *  - Blurred, dimmed backdrop; white rounded card; a header with a soft icon tile (or initials
 *    avatar), a bold title, a muted subtitle (or badges) and a round close button top right.
 *  - Body is made of bordered "cards" (ModalSection): each has a small icon tile, a title and a
 *    one-line description, followed by DetailRows (icon, label, value) or form fields.
 *  - Footer is a separate strip with right-aligned ModalButtons: soft neutral/danger for the
 *    secondary action, solid green for the primary one.
 *  - Forms: label above, required marked with a red *, input with a leading icon, helper text
 *    below, two columns on wide screens.
 *  - Typography is the app's Poppins; colours are the site palette (green #21CFB2, slate #6D7692,
 *    ink #1A1A1A). Tinted tiles/pills use ModalKit "tones": green, slate, blue, violet, amber, red.
 *  - View modals read data, form modals edit it. Use ModalShell for both.
 */

import { useEffect, useId, useState } from "react";
import Icon from "./Icon";
import "./modalkit.css";

export { Icon };

export function ModalShell({
  icon,
  iconTone = "green",
  avatar,
  title,
  badges,
  subtitle,
  headerActions,
  onClose,
  closeLogTitle,
  footer,
  children,
  size = "md",
  dismissOnOverlay = true,
  overlayClassName = "",
  as: Wrapper = "div",
  wrapperProps = {},
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className={`mk-overlay ${overlayClassName}`.trim()}
      onMouseDown={(e) => {
        if (dismissOnOverlay && e.target === e.currentTarget) onClose?.();
      }}
    >
      <Wrapper
        className={`mk-card mk-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...wrapperProps}
      >
        <header className="mk-header">
          {avatar ? (
            <div className="mk-avatar" aria-hidden="true">
              {avatar}
            </div>
          ) : icon ? (
            <div className={`mk-tile mk-tile-lg tone-${iconTone}`} aria-hidden="true">
              <Icon name={icon} size={26} />
            </div>
          ) : null}
          <div className="mk-header-text">
            <div className="mk-title-row">
              <h2 id={titleId} className="mk-title">
                {title}
              </h2>
              {badges ? <div className="mk-badges">{badges}</div> : null}
            </div>
            {subtitle ? <p className="mk-subtitle">{subtitle}</p> : null}
          </div>
          {headerActions ? <div className="mk-header-actions">{headerActions}</div> : null}
          {onClose ? (
            <button
              type="button"
              className="mk-close"
              onClick={onClose}
              aria-label="Close"
              data-log-title={closeLogTitle}
            >
              <Icon name="x" size={18} />
            </button>
          ) : null}
        </header>
        <div className="mk-body">{children}</div>
        {footer ? <footer className="mk-footer">{footer}</footer> : null}
      </Wrapper>
    </div>
  );
}

// Bordered card with an icon tile, title and description; children are its content.
export function ModalSection({ icon, tone = "slate", title, description, children, className = "" }) {
  return (
    <section className={`mk-section ${className}`.trim()}>
      {title ? (
        <div className="mk-section-head">
          {icon ? (
            <div className={`mk-tile tone-${tone}`} aria-hidden="true">
              <Icon name={icon} size={20} />
            </div>
          ) : null}
          <div>
            <h3 className="mk-section-title">{title}</h3>
            {description ? <p className="mk-section-desc">{description}</p> : null}
          </div>
        </div>
      ) : null}
      {children}
    </section>
  );
}

// Two-column responsive grid used for sections / form fields.
export function ModalGrid({ cols = 2, children, className = "" }) {
  return <div className={`mk-grid mk-cols-${cols} ${className}`.trim()}>{children}</div>;
}

export function DetailList({ children }) {
  return <div className="mk-detail-list">{children}</div>;
}

// One labelled value. Pass `tile` + `tone` for the coloured icon-tile variant (example 3).
export function DetailRow({ icon, label, value, tile = false, tone = "slate", mono = false }) {
  const empty = value === undefined || value === null || value === "";
  return (
    <div className="mk-detail-row">
      <div className="mk-detail-label">
        {icon ? (
          tile ? (
            <span className={`mk-tile mk-tile-sm tone-${tone}`} aria-hidden="true">
              <Icon name={icon} size={17} />
            </span>
          ) : (
            <Icon name={icon} size={17} className="mk-detail-icon" />
          )
        ) : null}
        <span>{label}</span>
      </div>
      <div className={mono ? "mk-detail-value mk-mono" : "mk-detail-value"}>
        {empty ? "—" : value}
      </div>
    </div>
  );
}

// Coloured status chip. tone: green | amber | red | blue | violet | slate
export function StatusPill({ tone = "slate", icon, dot = false, children }) {
  return (
    <span className={`mk-pill tone-${tone}`}>
      {dot ? <span className="mk-pill-dot" /> : null}
      {icon ? <Icon name={icon} size={14} /> : null}
      {children}
    </span>
  );
}

// Maps the app's client status keys to a pill tone.
export const STATUS_TONES = {
  approval_pending: "amber",
  under_review: "violet",
  register: "blue",
  scheduled: "blue",
  ongoing: "green",
  on_hold: "amber",
  cancelled: "red",
};

export function ModalButton({
  variant = "neutral",
  icon,
  children,
  type = "button",
  className = "",
  ...rest
}) {
  return (
    <button type={type} className={`mk-btn mk-btn-${variant} ${className}`.trim()} {...rest}>
      {icon ? <Icon name={icon} size={17} /> : null}
      {children}
    </button>
  );
}

// Form field: label (required star), control with leading icon, helper text, optional error.
export function ModalField({ label, required, hint, error, icon, htmlFor, children, className = "" }) {
  return (
    <div className={`mk-field ${className}`.trim()}>
      {label ? (
        <label className="mk-label" htmlFor={htmlFor}>
          {label}
          {required ? <span className="mk-required"> *</span> : null}
        </label>
      ) : null}
      <div className={error ? "mk-control has-error" : "mk-control"}>
        {icon ? <Icon name={icon} size={18} className="mk-control-icon" /> : null}
        {children}
      </div>
      {error ? <p className="mk-error">{error}</p> : hint ? <p className="mk-hint">{hint}</p> : null}
    </div>
  );
}

// Text-like input that fills the control; style comes from .mk-control input.
export function ModalInput({ label, required, hint, error, icon, id, ...inputProps }) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <ModalField
      label={label}
      required={required}
      hint={hint}
      error={error}
      icon={icon}
      htmlFor={inputId}
    >
      <input id={inputId} required={required} {...inputProps} />
    </ModalField>
  );
}

export function ModalSelect({ label, required, hint, error, icon, id, children, ...selectProps }) {
  const autoId = useId();
  const selectId = id || autoId;
  return (
    <ModalField
      label={label}
      required={required}
      hint={hint}
      error={error}
      icon={icon}
      htmlFor={selectId}
    >
      <select id={selectId} required={required} {...selectProps}>
        {children}
      </select>
      <Icon name="chevronDown" size={18} className="mk-control-trail" />
    </ModalField>
  );
}

export function ModalTextarea({ label, required, hint, error, icon, id, maxLength, value, ...rest }) {
  const autoId = useId();
  const areaId = id || autoId;
  const hintNode =
    maxLength !== undefined ? (
      <span className="mk-hint-row">
        <span>{hint}</span>
        <span>
          {String(value ?? "").length}/{maxLength}
        </span>
      </span>
    ) : (
      hint
    );
  return (
    <ModalField
      label={label}
      required={required}
      hint={hintNode}
      error={error}
      icon={icon}
      htmlFor={areaId}
      className="mk-field-area"
    >
      <textarea id={areaId} required={required} maxLength={maxLength} value={value} {...rest} />
    </ModalField>
  );
}

// Password input with a show/hide toggle (example 4).
export function ModalPasswordInput({ label, required, hint, error, id, ...inputProps }) {
  const autoId = useId();
  const inputId = id || autoId;
  const [shown, setShown] = useState(false);
  return (
    <ModalField
      label={label}
      required={required}
      hint={hint}
      error={error}
      icon="lock"
      htmlFor={inputId}
    >
      <input id={inputId} type={shown ? "text" : "password"} required={required} {...inputProps} />
      <button
        type="button"
        className="mk-control-btn"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
      >
        <Icon name={shown ? "eyeOff" : "eye"} size={18} />
      </button>
    </ModalField>
  );
}

// Value with a copy-to-clipboard button (credentials rows in example 1).
export function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <button
      type="button"
      className="mk-icon-btn"
      aria-label={label}
      title={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(String(value));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      <Icon name={copied ? "check" : "copy"} size={16} />
    </button>
  );
}

// Highlighted figure with an icon tile: small label, large value, muted sub line (example 1).
export function Stat({ icon, tone = "violet", label, value, sub }) {
  return (
    <div className="mk-stat">
      <span className={`mk-tile tone-${tone}`} aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <div className="mk-stat-label">{label}</div>
        <div className="mk-stat-value">{value || "—"}</div>
        {sub ? <div className="mk-stat-sub">{sub}</div> : null}
      </div>
    </div>
  );
}

export const initialsOf = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "?";
