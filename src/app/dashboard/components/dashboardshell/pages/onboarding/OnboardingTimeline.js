"use client";

// Form phases toggle their inline details; Phase 0 opens the document reader.
export default function OnboardingTimeline({ phases, activePhase, expandedPhase, onSelect, isPhaseSubmitted }) {
  return (
    <div className="onb-timeline">
      {phases.map((phase) => {
        const isActive = activePhase === phase.id;
        const isExpanded = expandedPhase === phase.id;
        const hasDetails = phase.id > 0;
        const submitted = isPhaseSubmitted(phase.id);
        return (
          <button
            type="button"
            key={phase.id}
            id={`onb-phase-trigger-${phase.id}`}
            className={`onb-tl-step ${submitted ? "submitted" : "pending"}${isActive ? " active" : ""}${isExpanded ? " expanded" : ""}`}
            onClick={() => onSelect(phase.id)}
            aria-label={`Phase ${phase.id}: ${phase.name} — ${submitted ? "Submitted" : "Not submitted"}`}
            aria-current={isActive ? "step" : undefined}
            aria-expanded={hasDetails ? isExpanded : undefined}
            aria-controls={hasDetails ? `onb-phase-details-${phase.id}` : undefined}
            data-log-title={hasDetails
              ? `${isExpanded ? "Collapse" : "Expand"} onboarding phase ${phase.id}: ${phase.name}`
              : "Open onboarding prerequisites"}
          >
            <span className="onb-tl-node">{phase.id}</span>
            <span className="onb-tl-label">Phase {phase.id}</span>
            <span className="onb-tl-name">{phase.name}</span>
            {hasDetails && (
              <svg className="onb-tl-chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
