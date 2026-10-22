"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Modal that hosts a single phase's form. Body scrolls independently.
export default function PhaseModal({
  id,
  name,
  totalPhases,
  onClose,
  onNext,
  initialSection,
  children,
}) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Always show each phase from the top when navigating between phases.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTop = 0;
    if (initialSection == null) return;
    const heading = body.querySelectorAll(".onb-section-title")[initialSection];
    if (heading) {
      heading.tabIndex = -1;
      body.scrollTop = heading.getBoundingClientRect().top - body.getBoundingClientRect().top - 16;
      heading.focus({ preventScroll: true });
    }
  }, [id, initialSection]);

  const isLast = id >= totalPhases;

  // Render above the shell's isolated content stage so the sidebar cannot cover the form.
  return createPortal(
    <div className="onb-modal-backdrop onb-v2" onClick={onClose}>
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

        <div className="onb-modal-body" ref={bodyRef}>{children}</div>

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
    </div>,
    document.body
  );
}
