"use client";

import { useEffect } from "react";

// Modal that hosts a single phase's form. Body scrolls independently.
export default function PhaseModal({
  id,
  name,
  totalPhases,
  onClose,
  onNext,
  children,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isLast = id >= totalPhases;

  return (
    <div className="onb-modal-backdrop" onClick={onClose}>
      <div className="onb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="onb-modal-header">
          <span className="onb-modal-badge">{id}</span>
          <div className="onb-modal-titles">
            <p className="onb-modal-title">
              Phase {id}: {name}
            </p>
            <p className="onb-modal-sub">
              Step {id} of {totalPhases}
            </p>
          </div>
          <button
            type="button"
            className="onb-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="onb-modal-body">{children}</div>

        <div className="onb-modal-footer">
          <button type="button" className="onb-modal-btn neutral" onClick={onClose}>
            Close
          </button>
          {!isLast && (
            <button
              type="button"
              className="onb-modal-btn primary"
              onClick={() => onNext(id + 1)}
            >
              Next phase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
