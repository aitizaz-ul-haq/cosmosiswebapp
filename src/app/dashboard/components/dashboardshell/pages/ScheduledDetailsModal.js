"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import ClientInfoModal from "./ClientInfoModal";
import ScheduleOnboardingModal from "./scheduling/ScheduleOnboardingModal";
import {
  dayPartOf,
  formatCompact,
  getBrowserTimeZone,
} from "./scheduling/timeUtils";
import { modalActionBtnStyle } from "./clientStatusShared";

function PasswordValue({ value }) {
  const [shown, setShown] = useState(false);
  if (!value) return "—";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
      <span style={{ fontFamily: "monospace" }}>{shown ? value : "••••••••••"}</span>
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        style={{ border: "none", background: "transparent", color: "#6D7692", cursor: "pointer", fontWeight: 600 }}
      >
        {shown ? "Hide" : "Show"}
      </button>
    </span>
  );
}

// Details of a scheduled onboarding: client info, credentials and the editable schedule.
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

  const extraRows = [
    ...(canEdit
      ? [
          { label: "Username", value: details?.username || client.username },
          { label: "Password", value: <PasswordValue value={details?.password} /> },
        ]
      : []),
    {
      label: "Scheduled for",
      value: at && tz ? `${formatCompact(at, tz)} (${dayPartOf(at, tz)})` : "",
    },
    {
      label: "Location",
      value: schedule.scheduledCity
        ? `${schedule.scheduledCity}, ${schedule.scheduledCountry}`
        : "",
    },
    {
      label: "Your time",
      value: at && tz && rmTz !== tz ? `${formatCompact(at, rmTz)} (${dayPartOf(at, rmTz)})` : "",
    },
  ];

  const handleSaved = (next) => {
    setDetails((prev) => ({ ...(prev || {}), ...next }));
    onScheduleChanged?.(client, next);
    setEditing(false);
  };

  return (
    <>
      <ClientInfoModal
        client={client}
        onClose={onClose}
        extraRows={extraRows}
        footerActions={
          <>
            {canEdit && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                data-log-title={`Edit schedule clicked: ${client.fullName || client.email}`}
                style={{ ...modalActionBtnStyle, backgroundColor: "#a78bfa" }}
              >
                Edit schedule
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              data-log-title={`Close Scheduled details: ${client.fullName || client.email}`}
              style={{ ...modalActionBtnStyle, backgroundColor: "var(--btn-green-light)" }}
            >
              Close
            </button>
          </>
        }
      />
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
