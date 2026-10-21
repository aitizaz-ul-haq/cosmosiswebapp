"use client";

export const formatCompletedAt = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function TickIcon() {
  return (
    <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true">
      <path
        d="M2.5 6.2l2.2 2.2 4.8-4.8"
        fill="none"
        stroke="#17b89b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// One submitted phase: tick, number, name, completion time, sub-section count and View button.
export default function PhaseRow({ submission: s, focusable = true, logLabel, onView }) {
  return (
    <div className="sub-phase">
      <span className="sub-phase-tick" aria-label={s.completed ? "Completed" : "In progress"}>
        {s.completed ? <TickIcon /> : null}
      </span>
      <span className="sub-phase-num">{s.phase}</span>
      <span className="sub-phase-name">{s.name}</span>
      <span className="sub-phase-when">
        {s.completedAt ? (
          <>
            <span className="sub-acc-label">Completed at</span> {formatCompletedAt(s.completedAt)}
          </>
        ) : (
          <span className="sub-phase-pending">Still in progress</span>
        )}
      </span>
      <span className="sub-phase-done">
        {!s.completed
          ? null
          : s.sections.length === s.totalSections
            ? `All sub-sections completed (${s.totalSections})`
            : `${s.sections.length} of ${s.totalSections} sub-sections completed`}
      </span>
      <button
        type="button"
        className="management-row-action is-edit"
        tabIndex={focusable ? 0 : -1}
        onClick={() => onView(s)}
        data-log-title={`View submission clicked: ${logLabel} - Phase ${s.phase}`}
      >
        View
      </button>
    </div>
  );
}
