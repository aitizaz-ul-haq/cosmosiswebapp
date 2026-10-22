"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LegalDocument from "./legal/LegalDocument";
import { getBrand } from "./legal/brand";
import { buildCharges } from "./legal/chargesContent";
import { buildTerms } from "./legal/termsContent";

const STEPS = [
  { key: "charges", title: "Charges and Regulatory Information", build: buildCharges },
  { key: "terms", title: "Terms and Conditions", build: buildTerms },
];

// Pixels of slack when deciding the reader has reached the end (zoom rounding).
const BOTTOM_TOLERANCE = 4;

// Phase 0 modal: each document must be scrolled to the end before the
// primary button unlocks ("Next" on the first, "Close" on the last).
export default function PrerequisitesModal({ companyName, onClose }) {
  const bodyRef = useRef(null);
  const [step, setStep] = useState(0);
  const [read, setRead] = useState({});

  const brand = useMemo(() => getBrand(companyName), [companyName]);
  const current = STEPS[step];
  const blocks = useMemo(() => current.build(brand), [current, brand]);
  const isLast = step === STEPS.length - 1;
  const unlocked = Boolean(read[current.key]);

  const checkBottom = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_TOLERANCE) {
      setRead((r) => (r[current.key] ? r : { ...r, [current.key]: true }));
    }
  }, [current.key]);

  // Start each document at the top; a document that fits without scrolling unlocks at once.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    checkBottom();
  }, [step, checkBottom]);

  useEffect(() => {
    window.addEventListener("resize", checkBottom);
    return () => window.removeEventListener("resize", checkBottom);
  }, [checkBottom]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Escape the dashboard stage's stacking isolation, as the phase forms do.
  return createPortal(
    <div className="onb-modal-backdrop onb-prerequisites-backdrop" onClick={onClose}>
      <div className="onb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="onb-modal-header">
          <span className="onb-modal-badge">0</span>
          <div className="onb-modal-titles">
            <p className="onb-modal-title">Phase 0: Prerequisites</p>
            <p className="onb-modal-sub">
              Part {step + 1} of {STEPS.length} · {current.title}
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

        <div
          className="onb-modal-body"
          ref={bodyRef}
          onScroll={checkBottom}
          tabIndex={0}
          role="region"
          aria-label={current.title}
        >
          <LegalDocument blocks={blocks} />
        </div>

        <div className="onb-modal-footer">
          {step > 0 ? (
            <button
              type="button"
              className="onb-modal-btn neutral"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          ) : (
            <button type="button" className="onb-modal-btn neutral" onClick={onClose}>
              Close
            </button>
          )}

          <span className="onb-gate-wrap">
            <button
              type="button"
              className="onb-modal-btn primary"
              disabled={!unlocked}
              aria-describedby={unlocked ? undefined : "onb-gate-hint"}
              onClick={isLast ? onClose : () => setStep(step + 1)}
            >
              {isLast ? "Close" : "Next"}
            </button>
            {!unlocked && (
              <span id="onb-gate-hint" role="tooltip" className="onb-gate-tip">
                Please scroll through the entire document carefully to continue.
              </span>
            )}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
