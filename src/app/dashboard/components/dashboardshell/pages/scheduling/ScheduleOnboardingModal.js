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
  ModalButton,
  ModalGrid,
  ModalInput,
  ModalPasswordInput,
  ModalSection,
  ModalShell,
  Stat,
} from "../modalkit/ModalKit";
import { logUIAction } from "@/lib/logUIAction";

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

  const title =
    step !== "form"
      ? "Confirm the scheduled time"
      : isEdit
        ? `Edit schedule for ${client.fullName}`
        : `Schedule onboarding for ${client.fullName}`;
  const closeLogTitle = `Closed Schedule form: ${client.fullName}`;

  if (step === "confirm" && ready) {
    const clientPart = dayPartOf(when, tz);
    const rmPart = dayPartOf(when, rmTz);
    return (
      <ModalShell
        icon="clock"
        title={title}
        subtitle={place}
        size="sm"
        dismissOnOverlay={false}
        onClose={onClose}
        closeLogTitle={closeLogTitle}
        footer={
          <>
            <ModalButton
              variant="danger"
              onClick={() => setStep("form")}
              data-log-title={`Change schedule time clicked: ${client.fullName}`}
            >
              Change time
            </ModalButton>
            <ModalButton
              variant="primary"
              icon="check"
              onClick={save}
              disabled={saving}
              data-log-title={`Confirm schedule onboarding clicked: ${client.fullName}`}
            >
              {saving ? "Saving..." : "Confirm and schedule"}
            </ModalButton>
          </>
        }
      >
        <ModalSection>
          <Stat
            icon="calendar"
            tone="violet"
            label={`In ${place} (${zoneAbbreviation(when, tz)})`}
            value={`${formatTime(when, tz)} (${clientPart})`}
            sub={formatDate(when, tz)}
          />
          {rmTz !== tz && (
            <Stat
              icon="pin"
              tone="blue"
              label={`In your location (${rmTz.replace(/_/g, " ")})`}
              value={`${formatTime(when, rmTz)} (${rmPart})`}
              sub={formatDate(when, rmTz)}
            />
          )}
        </ModalSection>
        <p className="mk-note">
          Is this the right time of day? Please check AM and PM carefully: the time you picked
          falls in the <strong>{clientPart.toLowerCase()}</strong>. If it is a mistake, go back and
          change it.
        </p>
        {!isEdit && (
          <p className="mk-note">
            The login credentials will be emailed to {client.email} at this time.
          </p>
        )}
      </ModalShell>
    );
  }

  return (
    <ModalShell
      as="form"
      wrapperProps={{
        onSubmit: (e) => {
          e.preventDefault();
          if (ready) setStep("confirm");
        },
      }}
      icon="calendar"
      title={title}
      subtitle={
        isEdit
          ? "Change when the client's onboarding email is sent."
          : "Create the login and choose when it is sent."
      }
      size="md"
      dismissOnOverlay={false}
      onClose={onClose}
      closeLogTitle={closeLogTitle}
      footer={
        <>
          <ModalButton
            variant="danger"
            onClick={onClose}
            data-log-title={`Cancel Schedule clicked: ${client.fullName}`}
          >
            Cancel
          </ModalButton>
          <ModalButton
            type="submit"
            variant="primary"
            icon="send"
            disabled={!ready}
            data-log-title={`Schedule Onboarding next clicked: ${client.fullName}`}
          >
            Continue
          </ModalButton>
        </>
      }
    >
      {!isEdit && (
        <>
          <p className="mk-note">
            Create the client&apos;s login now. It is emailed to {client.email} at the scheduled
            time and the client cannot log in before then.
          </p>
          <ModalGrid>
            <ModalInput
              label="Username"
              required
              icon="user"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
            <ModalPasswordInput
              label="Password"
              required
              hint="Minimum 8 characters."
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
            />
          </ModalGrid>
        </>
      )}
      <ModalGrid>
        <SearchableSelect
          label="Country"
          required
          icon="globe"
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
          required
          icon="pin"
          options={cityOptions}
          value={cityName}
          placeholder={country ? "Search a city" : "Select a country first"}
          disabled={!country}
          onChange={(o) => setCityName(o.value)}
        />
        <ModalInput
          label="Date"
          required
          icon="calendar"
          type="date"
          value={date}
          min={tz ? todayInZone(tz, now) : undefined}
          onChange={(e) => setDate(e.target.value)}
        />
        <ModalInput
          label="Time"
          required
          icon="clock"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </ModalGrid>

      <div className="mk-note">
        <div>
          Your time now ({rmTz.replace(/_/g, " ")}): <strong>{formatTime(now, rmTz)}</strong>
        </div>
        {tz && (
          <div>
            Time now in {place}: <strong>{formatTime(now, tz)}</strong> ({zoneAbbreviation(now, tz)})
          </div>
        )}
        <div>
          The date and time you enter is in {city ? `${city.name} time` : "the client's local time"}.
        </div>
      </div>

      {problem && <p className="mk-error">{problem}</p>}
    </ModalShell>
  );
}
