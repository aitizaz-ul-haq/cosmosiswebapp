"use client";

import { useEffect, useMemo, useState } from "react";
import SearchableSelect from "./SearchableSelect";
import { EUROPE_COUNTRIES } from "./europeLocations";
import {
  dayPartOf,
  formatDate,
  formatTime,
  getBrowserTimeZone,
  toZonedInputs,
  todayInZone,
  zonedTimeToUtc,
  zoneAbbreviation,
} from "./timeUtils";
import {
  modalActionBtnStyle,
  modalFieldStyle,
  modalOverlayStyle,
} from "../clientStatusShared";
import { logUIAction } from "@/lib/logUIAction";

const cardStyle = {
  background: "#fff",
  width: "min(560px, 92vw)",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "12px",
  padding: "1.25rem",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  textAlign: "left",
};
const labelStyle = { fontSize: "0.85rem", fontWeight: 600, color: "#374151" };
const noteStyle = {
  margin: 0,
  padding: "0.6rem 0.8rem",
  borderRadius: "8px",
  background: "#f3f4f6",
  fontSize: "0.85rem",
  color: "#374151",
};

const COUNTRY_OPTIONS = EUROPE_COUNTRIES.map((c) => ({
  value: c.code,
  label: c.name,
  flag: c.flag,
}));

// mode "create" also collects the login credentials; "edit" (with `initial`) only changes the schedule.
export default function ScheduleOnboardingModal({
  client,
  mode = "create",
  initial = null,
  onClose,
  onScheduled,
}) {
  const isEdit = mode === "edit";
  const rmTz = useMemo(() => getBrowserTimeZone(), []);
  const initialCountry = initial
    ? EUROPE_COUNTRIES.find((c) => c.name === initial.scheduledCountry)
    : null;
  const initialInputs =
    initial?.scheduledRegistrationAt && initial?.scheduledTimeZone
      ? toZonedInputs(new Date(initial.scheduledRegistrationAt), initial.scheduledTimeZone)
      : null;
  const [countryCode, setCountryCode] = useState(initialCountry?.code || "");
  const [cityName, setCityName] = useState(initialCountry ? initial.scheduledCity : "");
  const [date, setDate] = useState(initialInputs?.date || "");
  const [time, setTime] = useState(initialInputs?.time || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("form");
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const country = EUROPE_COUNTRIES.find((c) => c.code === countryCode) || null;
  const city = country?.cities.find((c) => c.name === cityName) || null;
  const cityOptions = (country?.cities || []).map((c) => ({ value: c.name, label: c.name }));
  const tz = city?.tz || "";

  const when = date && time && tz ? zonedTimeToUtc(date, time, tz) : undefined;
  let problem = "";
  if (date && time && tz) {
    if (when === null) problem = `${time} does not exist in ${city.name} on that date (clocks change).`;
    else if (when.getTime() <= now.getTime()) problem = "The selected date and time has already passed.";
  }
  const credentialsOk = isEdit || (username.trim() && !/\s/.test(username) && password.length >= 8);
  const ready = Boolean(when) && !problem && Boolean(credentialsOk);

  const place = city ? `${city.name}, ${country.name}` : "";

  const save = async () => {
    if (!ready || saving) return;
    setSaving(true);
    try {
      const id = client?.profileId || client?.userId || client?._id;
      const scheduleBody = {
        scheduledAt: when.toISOString(),
        country: country.name,
        city: city.name,
        timeZone: tz,
      };
      const res = await fetch(
        `/api/clients/${isEdit ? "scheduled" : "registry"}?id=${encodeURIComponent(id)}`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(
            isEdit ? scheduleBody : { ...scheduleBody, action: "schedule", username, password }
          ),
        }
      );
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(result?.error || "Failed to schedule onboarding");
        return;
      }
      onScheduled({
        scheduledRegistrationAt: when.toISOString(),
        scheduledCountry: country.name,
        scheduledCity: city.name,
        scheduledTimeZone: tz,
        ...(isEdit ? {} : { status: "scheduled", username: username.trim().toLowerCase() }),
      });
      logUIAction("record_updated", {
        title: `${isEdit ? "Rescheduled" : "Scheduled"} onboarding for client: ${client.fullName || client.email}`,
        entityType: "client",
        entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
      });
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
      <h3 style={{ margin: 0, width: "100%", textAlign: "center", fontSize: "1.2rem" }}>
        {step !== "form"
          ? "Confirm the scheduled time"
          : isEdit
            ? `Edit schedule for ${client.fullName}`
            : `Schedule onboarding for ${client.fullName}`}
      </h3>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        data-log-title={`Closed Schedule form: ${client.fullName}`}
        style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}
      >
        ✕
      </button>
    </div>
  );

  if (step === "confirm" && ready) {
    const clientPart = dayPartOf(when, tz);
    const rmPart = dayPartOf(when, rmTz);
    return (
      <div style={modalOverlayStyle}>
        <div style={cardStyle} role="dialog" aria-label="Confirm scheduled time">
          {header}
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <p style={{ ...noteStyle, background: "#ede9fe" }}>
              <strong>{formatDate(when, tz)}</strong> at{" "}
              <strong>
                {formatTime(when, tz)} ({clientPart})
              </strong>{" "}
              in {place} ({zoneAbbreviation(when, tz)}).
            </p>
            {rmTz !== tz && (
              <p style={noteStyle}>
                In your location ({rmTz.replace(/_/g, " ")}) this is{" "}
                <strong>
                  {formatTime(when, rmTz)} ({rmPart})
                </strong>
                , {formatDate(when, rmTz)}.
              </p>
            )}
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
              Is this the right time of day? Please check AM and PM carefully: the time you picked
              falls in the <strong>{clientPart.toLowerCase()}</strong>. If it is a mistake, go back
              and change it.
            </p>
            {!isEdit && (
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
                The login credentials will be emailed to {client.email} at this time.
              </p>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={() => setStep("form")}
              data-log-title={`Change schedule time clicked: ${client.fullName}`}
              style={{ ...modalActionBtnStyle, backgroundColor: "#E57373" }}
            >
              Change time
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              data-log-title={`Confirm schedule onboarding clicked: ${client.fullName}`}
              style={{ ...modalActionBtnStyle, backgroundColor: "#a78bfa" }}
            >
              {saving ? "Saving..." : "Confirm and schedule"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={modalOverlayStyle}>
      <form
        style={cardStyle}
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) setStep("confirm");
        }}
      >
        {header}
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {!isEdit && (
            <>
              <p style={{ ...noteStyle, background: "#ede9fe" }}>
                Create the client's login now. It is emailed to {client.email} at the scheduled time
                and the client cannot log in before then.
              </p>
              <input
                style={modalFieldStyle}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
              <input
                style={modalFieldStyle}
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </>
          )}
          <SearchableSelect
            label="Country"
            options={COUNTRY_OPTIONS}
            value={countryCode}
            placeholder="Search a country"
            onChange={(o) => {
              setCountryCode(o.value);
              setCityName("");
            }}
          />
          <SearchableSelect
            label="City"
            options={cityOptions}
            value={cityName}
            placeholder={country ? "Search a city" : "Select a country first"}
            disabled={!country}
            onChange={(o) => setCityName(o.value)}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label style={labelStyle}>
              Date
              <input
                style={modalFieldStyle}
                type="date"
                value={date}
                min={tz ? todayInZone(tz, now) : undefined}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <label style={labelStyle}>
              Time
              <input
                style={modalFieldStyle}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </label>
          </div>

          <div style={noteStyle}>
            <div>
              Your time now ({rmTz.replace(/_/g, " ")}): <strong>{formatTime(now, rmTz)}</strong>
            </div>
            {tz && (
              <div>
                Time now in {place}: <strong>{formatTime(now, tz)}</strong> ({zoneAbbreviation(now, tz)})
              </div>
            )}
            <div style={{ marginTop: "0.25rem", color: "#6b7280" }}>
              The date and time you enter is in {city ? `${city.name} time` : "the client's local time"}.
            </div>
          </div>

          {problem && (
            <div style={{ ...noteStyle, background: "#fee2e2", color: "#7f1d1d" }}>{problem}</div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={onClose}
            data-log-title={`Cancel Schedule clicked: ${client.fullName}`}
            style={{ ...modalActionBtnStyle, backgroundColor: "#E57373" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ready}
            data-log-title={`Schedule Onboarding next clicked: ${client.fullName}`}
            style={{ ...modalActionBtnStyle, backgroundColor: "#a78bfa" }}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
