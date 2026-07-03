"use client";

// Interactive 6-part timeline. Clicking a step toggles/opens that phase.
export default function OnboardingTimeline({ phases, activePhase, onSelect }) {
  return (
    <div className="onb-timeline">
      {phases.map((phase) => {
        const isActive = activePhase === phase.id;
        return (
          <button
            type="button"
            key={phase.id}
            className={`onb-tl-step${isActive ? " active" : ""}`}
            onClick={() => onSelect(phase.id)}
          >
            <span className="onb-tl-node">{phase.id}</span>
            <span className="onb-tl-label">Phase {phase.id}</span>
            <span className="onb-tl-name">{phase.name}</span>
          </button>
        );
      })}
    </div>
  );
}
