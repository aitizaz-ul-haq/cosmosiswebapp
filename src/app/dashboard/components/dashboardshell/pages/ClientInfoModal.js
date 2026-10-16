"use client";

import { STATUS_LABELS, onboardingTypeLabel } from "./clientStatusShared";
import {
  DetailList,
  DetailRow,
  Icon,
  ModalButton,
  ModalGrid,
  ModalSection,
  ModalShell,
  STATUS_TONES,
  StatusPill,
  initialsOf,
} from "./modalkit/ModalKit";

// Read-only client details (example_modal_3). Callers can pass their own footer buttons
// (built with ModalButton) and extra rows that appear in an "Additional details" card.
export default function ClientInfoModal({ client, onClose, footerActions, extraRows = [] }) {
  if (!client) return null;

  const name = client.fullName || client.username || "Client details";
  const statusKey = client.status || "ongoing";
  const statusLabel = STATUS_LABELS[statusKey] || statusKey;
  const logName = client.fullName || client.email;

  return (
    <ModalShell
      avatar={initialsOf(name)}
      title={name}
      badges={
        <StatusPill tone={STATUS_TONES[statusKey] || "slate"} icon="clock">
          {statusLabel}
        </StatusPill>
      }
      subtitle="Client details and current status."
      onClose={onClose}
      closeLogTitle={`Close Client Info modal: ${logName}`}
      size="md"
      footer={
        footerActions || (
          <ModalButton
            variant="neutral"
            icon="x"
            onClick={onClose}
            data-log-title={`Close Client Info modal: ${logName}`}
          >
            Close
          </ModalButton>
        )
      }
    >
      <ModalGrid>
        <ModalSection>
          <DetailList>
            <DetailRow tile tone="blue" icon="user" label="Full name" value={client.fullName} />
            <DetailRow tile tone="green" icon="mail" label="Email" value={client.email} />
            <DetailRow tile tone="violet" icon="phone" label="Phone" value={client.phone} />
            <DetailRow
              tile
              tone="blue"
              icon="file"
              label="Status"
              value={<StatusPill tone={STATUS_TONES[statusKey] || "slate"}>{statusLabel}</StatusPill>}
            />
          </DetailList>
        </ModalSection>

        <ModalSection>
          <DetailList>
            <DetailRow
              tile
              tone="violet"
              icon="users"
              label="Onboarding type"
              value={onboardingTypeLabel(client.onboardingType)}
            />
            <DetailRow tile tone="blue" icon="briefcase" label="RM name" value={client.assignedToName} />
            <DetailRow
              tile
              tone="green"
              icon="share"
              label="Shared with"
              value={(client.sharedWithNames || []).join(", ")}
            />
            <DetailRow tile tone="violet" icon="user" label="Assigned by" value={client.assignedByName} />
          </DetailList>
        </ModalSection>
      </ModalGrid>

      <div className="mk-panel">
        <div className="mk-panel-head">
          <span className="mk-tile mk-tile-sm tone-violet" aria-hidden="true">
            <Icon name="file" size={17} />
          </span>
          <h3 className="mk-section-title">RM remarks</h3>
        </div>
        <p className="mk-panel-text">{client.rmRemarks || "No remarks added."}</p>
      </div>

      {extraRows.length > 0 ? (
        <ModalSection icon="info" tone="slate" title="Additional details">
          <DetailList>
            {extraRows.map((row) => (
              <DetailRow key={row.label} label={row.label} value={row.value} />
            ))}
          </DetailList>
        </ModalSection>
      ) : null}

      <ModalSection>
        <DetailList>
          <DetailRow
            tile
            tone="blue"
            icon="calendar"
            label="Created"
            value={client.createdAt ? new Date(client.createdAt).toLocaleString() : ""}
          />
        </DetailList>
      </ModalSection>
    </ModalShell>
  );
}
