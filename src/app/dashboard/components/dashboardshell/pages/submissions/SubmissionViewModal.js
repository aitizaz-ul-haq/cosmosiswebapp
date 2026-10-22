"use client";

import {
  DetailList,
  DetailRow,
  ModalButton,
  ModalSection,
  ModalShell,
} from "../modalkit/ModalKit";
import "../styles/submissions.css";

export default function SubmissionViewModal({ clientName, submission, onClose, clientActions = false }) {
  return (
    <ModalShell
      size="lg"
      overlayClassName={`mk-submission-overlay${submission.sections.length > 1 ? " has-multiple-sections" : ""}`}
      icon="file"
      title={submission.name}
      subtitle={`${clientName} - Phase ${submission.phase}`}
      onClose={onClose}
      headerActions={
        clientActions ? (
          <>
            {/* Placeholders: behaviour to be added later */}
            <ModalButton
              variant="neutral"
              icon="send"
              data-log-title={`Notify RM clicked: Phase ${submission.phase}`}
            >
              Notify RM
            </ModalButton>
            <ModalButton
              variant="primary"
              icon="pencil"
              data-log-title={`Edit submission clicked: Phase ${submission.phase}`}
            >
              Edit
            </ModalButton>
          </>
        ) : null
      }
      footer={
        <ModalButton variant="neutral" icon="x" onClick={onClose}>
          Close
        </ModalButton>
      }
    >
      <div className="sub-details-grid">
        {submission.sections.map((section) => (
          <ModalSection key={section.title} icon="file" tone="green" title={section.title}>
            <DetailList>
              {section.fields.map((f) => (
                <DetailRow key={f.label} label={f.label} value={f.value} />
              ))}
            </DetailList>
          </ModalSection>
        ))}
      </div>
    </ModalShell>
  );
}
