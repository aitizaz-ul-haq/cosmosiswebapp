"use client";

import { useEffect } from "react";
import { modalOverlayStyle } from "../clientStatusShared";
import "../styles/submissions.css";

export default function SubmissionViewModal({ clientName, submission, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div style={modalOverlayStyle} onMouseDown={onClose}>
      <div
        className="sub-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Phase ${submission.phase} submission`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sub-modal-head">
          <div>
            <div className="sub-modal-eyebrow">
              {clientName} · Phase {submission.phase}
            </div>
            <h3 className="sub-modal-title">{submission.name}</h3>
          </div>
          <button type="button" className="sub-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="sub-modal-body">
          {submission.sections.map((section) => (
            <div className="sub-modal-section" key={section.title}>
              <h4>{section.title}</h4>
              <dl>
                {section.fields.map((f) => (
                  <div className="sub-modal-field" key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
