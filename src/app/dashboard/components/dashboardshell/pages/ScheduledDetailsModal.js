"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import ScheduleOnboardingModal from "./scheduling/ScheduleOnboardingModal";
import {
  dayPartOf,
  formatDate,
  formatTime,
  getBrowserTimeZone,
  zoneAbbreviation,
} from "./scheduling/timeUtils";
import { STATUS_LABELS, onboardingTypeLabel } from "./clientStatusShared";
import {
  CopyButton,
  DetailList,
  DetailRow,
  Icon,
  ModalButton,
  ModalGrid,
  ModalSection,
  ModalShell,
  STATUS_TONES,
  Stat,
  StatusPill,
} from "./modalkit/ModalKit";

function PasswordValue({ value }) {
  const [shown, setShown] = useState(false);
  if (!value) return "—";
  return (
    <span className="mk-value-actions">
      <span className="mk-mono">{shown ? value : "••••••••••"}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
        <button type="button" className="mk-link-btn" onClick={() => setShown((s) => !s)}>
          {shown ? "Hide" : "Show"}
        </button>
        <CopyButton value={value} label="Copy password" />
      </span>
    </span>
  );
}

const zoneLine = (at, tz) => `${zoneAbbreviation(at, tz)} (${dayPartOf(at, tz)})`;
const whenLine = (at, tz) => `${formatDate(at, tz)}, ${formatTime(at, tz)}`;

// Details of a scheduled onboarding (example_modal_1): overview, credentials and the schedule.
export default function ScheduledDetailsModal({ client, onClose, onScheduleChanged }) {
  const { user } = useUser();
  const canEdit = user?.role === "rm";
  const [details, setDetails] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!client || !canEdit) return undefined;
    let isMounted = true;
    const id = client.profileId || client.userId || client._id;
    fetch(`/api/clients/scheduled?id=${encodeURIComponent(id)}`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (isMounted && data?.success) setDetails(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [client, canEdit]);

  if (!client) return null;

  const schedule = {
    scheduledRegistrationAt: details?.scheduledRegistrationAt || client.scheduledRegistrationAt,
    scheduledCountry: details?.scheduledCountry || client.scheduledCountry,
    scheduledCity: details?.scheduledCity || client.scheduledCity,
    scheduledTimeZone: details?.scheduledTimeZone || client.scheduledTimeZone,
  };
  const at = schedule.scheduledRegistrationAt ? new Date(schedule.scheduledRegistrationAt) : null;
  const tz = schedule.scheduledTimeZone;
  const rmTz = getBrowserTimeZone();
  const hasSchedule = Boolean(at && tz);
  const statusKey = client.status || "scheduled";
  const username = details?.username || client.username;
  const logName = client.fullName || client.email;

  const handleSaved = (next) => {
    setDetails((prev) => ({ ...(prev || {}), ...next }));
    onScheduleChanged?.(client, next);
    setEditing(false);
  };

  return (
    <>
      <ModalShell
        icon="user"
        title="Client Schedule Details"
        subtitle="View the complete information, credentials and schedule for this client."
        onClose={onClose}
        closeLogTitle={`Close Scheduled details: ${logName}`}
        size="lg"
        footer={
          <>
            {canEdit && (
              <ModalButton
                variant="primary"
                icon="calendar"
                onClick={() => setEditing(true)}
                data-log-title={`Edit schedule clicked: ${logName}`}
              >
                Edit schedule
              </ModalButton>
            )}
            <ModalButton
              variant="neutral"
              onClick={onClose}
              data-log-title={`Close Scheduled details: ${logName}`}
            >
              Close
            </ModalButton>
          </>
        }
      >
        <ModalGrid>
          <div className="mk-stack">
            <ModalSection
              icon="file"
              tone="violet"
              title="Overview"
              description="Key information and credentials for this client record."
            >
              <DetailList>
                <DetailRow
                  label="Status"
                  value={
                    <StatusPill tone={STATUS_TONES[statusKey] || "slate"} dot>
                      {STATUS_LABELS[statusKey] || statusKey}
                    </StatusPill>
                  }
                />
                <DetailRow label="Onboarding type" value={onboardingTypeLabel(client.onboardingType)} />
                <DetailRow label="RM name" value={client.assignedToName} />
                <DetailRow label="Shared with" value={(client.sharedWithNames || []).join(", ")} />
                <DetailRow label="Assigned by" value={client.assignedByName} />
              </DetailList>

              {canEdit && (
                <div className="mk-panel mk-panel-flush">
                  <DetailList>
                    <DetailRow
                      tile
                      tone="violet"
                      icon="user"
                      label="Username"
                      value={
                        <span className="mk-value-actions">
                          <span>{username || "—"}</span>
                          <CopyButton value={username} label="Copy username" />
                        </span>
                      }
                    />
                    <DetailRow
                      tile
                      tone="violet"
                      icon="lock"
                      label="Password"
                      value={<PasswordValue value={details?.password} />}
                    />
                  </DetailList>
                </div>
              )}
            </ModalSection>

            <ModalSection icon="file" tone="slate" title="RM remarks">
              <div className="mk-panel">
                <p className="mk-panel-text">{client.rmRemarks || "No remarks added."}</p>
              </div>
            </ModalSection>
          </div>

          <div className="mk-stack">
            <ModalSection
              icon="calendar"
              tone="violet"
              title="Schedule & Timing"
              description="Meeting schedule and timezone details."
            >
              <div className="mk-panel">
                <Stat
                  icon="calendar"
                  label="Scheduled for"
                  value={hasSchedule ? whenLine(at, tz) : ""}
                  sub={hasSchedule ? zoneLine(at, tz) : ""}
                />
                {hasSchedule && rmTz !== tz ? (
                  <Stat
                    icon="clock"
                    label="Your time"
                    value={whenLine(at, rmTz)}
                    sub={zoneLine(at, rmTz)}
                  />
                ) : null}
                <div className="mk-location">
                  <Icon name="pin" size={18} className="mk-detail-icon" />
                  <span className="mk-detail-label">Location</span>
                  {schedule.scheduledCity ? (
                    <StatusPill tone="green" icon="pin">
                      {schedule.scheduledCity}, {schedule.scheduledCountry}
                    </StatusPill>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            </ModalSection>

            <ModalSection
              icon="clock"
              tone="violet"
              title="Other Information"
              description="Additional details about this record."
            >
              <DetailList>
                <DetailRow
                  icon="calendar"
                  label="Created"
                  value={client.createdAt ? new Date(client.createdAt).toLocaleString() : ""}
                />
              </DetailList>
            </ModalSection>
          </div>
        </ModalGrid>
      </ModalShell>
      {editing && (
        <ScheduleOnboardingModal
          client={client}
          mode="edit"
          initial={schedule}
          onClose={() => setEditing(false)}
          onScheduled={handleSaved}
        />
      )}
    </>
  );
}
