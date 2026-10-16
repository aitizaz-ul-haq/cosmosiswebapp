"use client";

import { PHASE_SECTIONS, actionBtnStyle } from "../clientStatusShared";
import Icon from "../modalkit/Icon";

function SubmissionIcon({ submitted }) {
  return (
    <span className={`onb-section-status-icon ${submitted ? "submitted" : "pending"}`} aria-hidden="true">
      <svg viewBox="0 0 12 12" width="10" height="10">
        <path
          d={submitted ? "M2.5 6.2l2.2 2.2 4.8-4.8" : "m3.2 3.2 5.6 5.6m0-5.6L3.2 8.8"}
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
            </div>
            <div className="onb-phase-detail-heading-end">
              <div className="onb-phase-detail-actions">
                {rmEmail ? (
                  <a
                    className="dash-action-btn dash-btn-neutral"
                    style={actionBtnStyle}
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
                    style={actionBtnStyle}
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
                  style={actionBtnStyle}
                  onClick={() => onStart(phase.id)}
                  tabIndex={expanded ? 0 : -1}
                  data-log-title={`Start Phase ${phase.id} button clicked: ${phase.name}`}
                >
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

          <ol className="onb-phase-sections">
            {sections.map((section, index) => {
              const start = sections.length > 1
                ? 1 + Math.round((index / (sections.length - 1)) * 7)
                : 1;
              return (
                <li
                  key={section}
                  className={`onb-phase-section ${submitted ? "submitted" : "pending"}`}
                  aria-label={`${section} — ${submitted ? "Submitted" : "Not submitted"}`}
                  style={{
                    gridColumn: `${start} / span ${sections.length > 1 ? 5 : 8}`,
                    gridRow: index + 1,
                    "--section-delay": `${120 + index * 60}ms`,
                  }}
                >
                  <SubmissionIcon submitted={submitted} />
                  <h4>{section}</h4>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
