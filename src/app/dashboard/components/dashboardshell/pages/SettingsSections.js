"use client";

import { useId, useState } from "react";
import { getRoleLabel } from "@/lib/roles";
import { useDashboardThemeControls } from "../useDashboardTheme";
import DashboardShellIcon from "../subcomps/microcomps/dashboardshellicon";
import Icon from "./modalkit/Icon";
import "./styles/settings.css";

const displayValue = (value) => value === null || value === undefined || value === "" ? "—" : value;

function InformationFields({ fields }) {
  return (
    <dl className="settings-information-grid">
      {fields.map(([label, value]) => <div className="settings-information-field" key={label}><dt>{label}</dt><dd>{displayValue(value)}</dd></div>)}
    </dl>
  );
}

function SettingsAccordion({ sectionKey, title, description, icon, expanded, onToggle, editAction, children, idPrefix }) {
  const headingId = `${idPrefix}-${sectionKey}-heading`;
  const panelId = `${idPrefix}-${sectionKey}-panel`;
  return (
    <section className="settings-accordion-item" data-section={sectionKey}>
      <div className="settings-accordion-header">
        <h3>
          <button id={headingId} type="button" className="settings-accordion-toggle" aria-label={title} aria-expanded={expanded} aria-controls={panelId} onClick={onToggle} data-log-title={`Settings: ${expanded ? "Collapse" : "Expand"} ${title}`}>
            <span className="settings-accordion-icon"><Icon name={icon} size={20} /></span>
            <span className="settings-accordion-label"><span className="settings-accordion-title">{title}</span><span className="settings-accordion-description">{description}</span></span>
            <Icon name="chevronDown" size={18} className="settings-accordion-chevron" />
          </button>
        </h3>
        {editAction && <button type="button" className="settings-inline-edit" onClick={editAction.onClick} disabled={editAction.disabled} aria-label={`Edit ${title}`} title={editAction.disabled ? `${title} is unavailable` : `Edit ${title}`} data-log-title={`Settings: Edit ${title}`}><Icon name="pencil" size={14} /><span>Edit</span></button>}
      </div>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        aria-hidden={!expanded}
        inert={!expanded ? "" : undefined}
        className={`settings-accordion-panel${expanded ? " is-expanded" : ""}`}
      >
        <div className="settings-accordion-panel-inner">
          <div className="settings-accordion-panel-content">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function SettingsSections({ userDetails, companyDetails, formatDate, securityForm, onEditPersonal, onEditCompany }) {
  const [openSection, setOpenSection] = useState(null);
  const idPrefix = useId();
  const themeControls = useDashboardThemeControls();
  const darkMode = themeControls?.theme === "dark";
  const user = userDetails || {};
  const status = user.isActive ? "Active" : "Inactive";
  const companyName = companyDetails?.name || user.companyName || "—";
  const joined = formatDate?.(user.createdAt) || "—";
  const summaries = [
    { label: "Account Status", value: status, icon: "shield", tone: user.isActive ? "green" : "slate" },
    { label: "Role", value: getRoleLabel(user.role), icon: "user", tone: "violet" },
    { label: "Company", value: companyName, icon: "building", tone: "blue" },
    { label: "Member Since", value: joined, icon: "calendar", tone: "green" },
  ];
  const toggle = (key) => setOpenSection((current) => current === key ? null : key);
  const accordionProps = (key) => ({ sectionKey: key, expanded: openSection === key, onToggle: () => toggle(key), idPrefix });

  return (
    <div className="settings-sections">
      <div className="settings-summary-scroll" role="region" aria-label="Account summary" tabIndex={0}>
        <dl className="settings-summary-row">
          {summaries.map((summary) => <div className={`settings-summary-card tone-${summary.tone}`} key={summary.label}><dt><span className="settings-summary-icon"><Icon name={summary.icon} size={20} /></span>{summary.label}</dt><dd title={String(displayValue(summary.value))}>{displayValue(summary.value)}</dd></div>)}
        </dl>
      </div>

      <section className="settings-section-list" aria-labelledby={`${idPrefix}-title`}>
        <h2 id={`${idPrefix}-title`}>Settings</h2>
        <div className="settings-accordion-list">
          <SettingsAccordion {...accordionProps("security")} title="Security" description="Password and account protection" icon="lock">
            {securityForm || <p className="settings-unavailable">Security settings are unavailable.</p>}
          </SettingsAccordion>

          <SettingsAccordion {...accordionProps("appearance")} title="Appearance" description="Light and dark mode" icon="eye">
            <div className="settings-appearance-row">
              <span className={`settings-appearance-label${!darkMode ? " is-selected" : ""}`}><DashboardShellIcon name="sun" size={21} /><span>Light mode</span></span>
              <button type="button" className="settings-appearance-switch" role="switch" aria-label="Dark mode" aria-checked={darkMode} disabled={!themeControls} onClick={() => themeControls?.setTheme(darkMode ? "light" : "dark")} data-log-title={`Settings: Switch to ${darkMode ? "light" : "dark"} mode`}><span className="settings-appearance-thumb" /></button>
              <span className={`settings-appearance-label${darkMode ? " is-selected" : ""}`}><DashboardShellIcon name="moon" size={21} /><span>Dark mode</span></span>
            </div>
            <p className="settings-appearance-hint">Your appearance preference is saved in this browser.</p>
          </SettingsAccordion>

          <SettingsAccordion {...accordionProps("personal")} title="Personal Information" description="Your account and contact details" icon="user" editAction={{ onClick: onEditPersonal, disabled: !userDetails || !onEditPersonal }}>
            <InformationFields fields={[
              ["Username", user.username], ["Full Name", user.fullName], ["Phone", user.phone], ["Company", companyName],
              ["Role", getRoleLabel(user.role)], ["Email", user.email], ["Status", status], ["Account Created", joined],
            ]} />
          </SettingsAccordion>

          <SettingsAccordion {...accordionProps("company")} title="Company Information" description="Company details and primary contact" icon="building" editAction={{ onClick: onEditCompany, disabled: !companyDetails || !onEditCompany }}>
            {companyDetails ? <InformationFields fields={[
              ["Company Name", companyDetails.name], ["Legal Name", companyDetails.legalName], ["Website", companyDetails.website], ["Registration No.", companyDetails.registrationNumber],
              ["Tax ID", companyDetails.taxId], ["Status", companyDetails.status], ["Contact Name", companyDetails.primaryContact?.fullName], ["Contact Email", companyDetails.primaryContact?.email],
            ]} /> : <p className="settings-unavailable">Company information is unavailable. Contact your administrator if your account needs a company assignment.</p>}
          </SettingsAccordion>
        </div>
      </section>
    </div>
  );
}
