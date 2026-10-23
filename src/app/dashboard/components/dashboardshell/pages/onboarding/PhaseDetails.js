"use client";

import { PHASE_SECTIONS } from "../clientStatusShared";
import Icon from "../modalkit/Icon";

const PHASE_DESCRIPTIONS = {
  1: "Complete the sections below to provide your personal details and related information.",
  2: "Provide details about the sources of your wealth and the funds you plan to invest.",
  3: "Tell us about your finances, investment goals and experience in the sections below.",
  4: "Complete the sections below to help us understand your approach to investment risk.",
  5: "Review and provide the signatures required for your onboarding application.",
  6: "Review the checklist and provide the documents required to complete your application.",
};

function SubmissionIcon({ submitted }) {
  return (
    <span className={`onb-section-status-icon ${submitted ? "submitted" : "pending"}`} aria-hidden="true">
      <svg viewBox="0 0 12 12" width="10" height="10">
        {submitted ? (
          <path d="M2.5 6.2l2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <circle cx="6" cy="6" r="2" fill="currentColor" />
        )}
      </svg>
    </span>
  );
}

// Keep the panels mounted so the grid transition can reverse during rapid clicks.
export default function PhaseDetails({ phase, expanded, submitted, assignedRm, onStart }) {
  const sections = PHASE_SECTIONS[phase.id] || [];
  const rmEmail = assignedRm?.email?.trim();
  const emailHref = rmEmail
    ? `mailto:${encodeURIComponent(rmEmail).replace(/%40/g, "@")}?subject=${encodeURIComponent(`Onboarding — Phase ${phase.id}: ${phase.name}`)}`
    : undefined;

  return (
    <section
      id={`onb-phase-details-${phase.id}`}
      className={`onb-phase-detail-wrap ${submitted ? "submitted" : "pending"}${expanded ? " open" : ""}`}
      aria-labelledby={`onb-phase-trigger-${phase.id}`}
      aria-hidden={!expanded}
      inert={expanded ? undefined : ""}
    >
      <div className="onb-phase-detail-clip">
        <div className="onb-phase-detail">
          <div className="onb-phase-detail-heading">
            <div>
              <p className="onb-phase-detail-label">Phase {phase.id}</p>
              <h3 className="onb-phase-detail-title">{phase.name}</h3>
              <p className="onb-phase-detail-description">{PHASE_DESCRIPTIONS[phase.id]}</p>
            </div>
            <div className="onb-phase-detail-heading-end">
              <div className="onb-phase-detail-actions">
                {rmEmail ? (
                  <a
                    className="dash-action-btn dash-btn-neutral"
                    href={emailHref}
                    tabIndex={expanded ? 0 : -1}
                    title={`Email ${assignedRm.name || "your relationship manager"}`}
                    data-log-title={`Contact RM from onboarding phase ${phase.id}: ${phase.name}`}
                  >
                    <Icon name="mail" size={16} />
                    Contact RM
                  </a>
                ) : (
                  <button
                    type="button"
                    className="dash-action-btn dash-btn-neutral"
                    disabled
                    title="Your relationship manager's email is not available"
                  >
                    <Icon name="mail" size={16} />
                    Contact RM
                  </button>
                )}
                <button
                  type="button"
                  id={`onb-start-phase-${phase.id}`}
                  className="dash-action-btn dash-btn-green"
                  onClick={() => onStart(phase.id)}
                  tabIndex={expanded ? 0 : -1}
                  data-log-title={`Start Phase ${phase.id} button clicked: ${phase.name}`}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" fill="currentColor" />
                    <path d="m8.5 6.5 4.5 3.5-4.5 3.5z" className="onb-start-play" />
                  </svg>
                  Start Phase {phase.id}
                </button>
              </div>
              <span className="onb-phase-detail-number" aria-hidden="true">
                {String(phase.id).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="onb-phase-section-track" aria-hidden="true">
            {sections.map((section, index) => (
              <span
                key={section}
                className="onb-phase-section-dot"
                style={{ left: `${sections.length > 1 ? (index / (sections.length - 1)) * 100 : 0}%` }}
              />
            ))}
            {sections.length === 1 && <span className="onb-phase-section-dot" style={{ left: "100%" }} />}
          </div>

          <div className="onb-phase-section-labels" style={{ "--section-count": sections.length }} aria-hidden="true">
            {sections.map((section, index) => <span key={section}>Subsection {index + 1}</span>)}
          </div>

          <ol className="onb-phase-sections" style={{ "--section-count": sections.length }}>
            <li className="onb-phase-guides" aria-hidden="true">
              {Array.from({ length: sections.length + 1 }, (_, index) => <span key={index} style={{ left: `${index / sections.length * 100}%` }} />)}
            </li>
            {sections.map((section, index) => {
              return (
                <li
                  key={section}
                  className="onb-phase-section-item"
                  style={{
                    gridColumn: index + 1,
                    gridRow: index + 1,
                    "--section-delay": `${120 + index * 60}ms`,
                  }}
                >
                  <button
                    type="button"
                    id={`onb-section-${phase.id}-${index}`}
                    className={`onb-phase-section ${submitted ? "submitted" : "pending"}`}
                    onClick={() => onStart(phase.id, index)}
                    tabIndex={expanded ? 0 : -1}
                    aria-label={`${section} — ${submitted ? "Submitted" : "Not submitted"}. Open subsection ${index + 1} of phase ${phase.id}`}
                    data-log-title={`Open onboarding phase ${phase.id} subsection ${index + 1}: ${section}`}
                  >
                    <SubmissionIcon submitted={submitted} />
                    <span className="onb-phase-section-text"><span className="onb-phase-section-mobile-label">Subsection {index + 1}</span>{section}</span>
                    <svg className="onb-phase-section-chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
