// Time zone helpers built on Intl so scheduling needs no extra dependency.

export const getBrowserTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const wallParts = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
};

// Offset (ms) of `timeZone` from UTC at the given instant.
const offsetAt = (utcMs, timeZone) => {
  const p = wallParts(new Date(utcMs), timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return asUtc - Math.floor(utcMs / 60000) * 60000;
};

// Converts a wall-clock date ("YYYY-MM-DD") and time ("HH:mm") in `timeZone` to a UTC Date.
// Returns null when that wall time does not exist (skipped by a DST change).
export const zonedTimeToUtc = (dateStr, timeStr, timeZone) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return null;

  const naive = Date.UTC(y, m - 1, d, hh, mm);
  let utc = naive - offsetAt(naive, timeZone);
  utc = naive - offsetAt(utc, timeZone);

  const back = wallParts(new Date(utc), timeZone);
  const matches =
    back.year === y && back.month === m && back.day === d && back.hour === hh && back.minute === mm;
  return matches ? new Date(utc) : null;
};

export const todayInZone = (timeZone, now = new Date()) => {
  const p = wallParts(now, timeZone);
  const pad = (n) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
};

// Wall-clock values for <input type="date"> and <input type="time"> in `timeZone`.
export const toZonedInputs = (date, timeZone) => {
  const p = wallParts(date, timeZone);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${p.year}-${pad(p.month)}-${pad(p.day)}`,
    time: `${pad(p.hour)}:${pad(p.minute)}`,
  };
};

export const formatDate = (date, timeZone) =>
  date.toLocaleDateString("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatTime = (date, timeZone) =>
  date.toLocaleTimeString("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export const zoneAbbreviation = (date, timeZone) =>
  new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value || timeZone;

export const formatCompact = (date, timeZone) =>
  `${date.toLocaleDateString("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })}, ${formatTime(date, timeZone)} ${zoneAbbreviation(date, timeZone)}`;

// Morning 05:00-11:59, Noon 12:00-12:59, Afternoon 13:00-17:59, Night 18:00-04:59.
export const dayPartOf = (date, timeZone) => {
  const { hour } = wallParts(date, timeZone);
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour === 12) return "Noon";
  if (hour >= 13 && hour < 18) return "Afternoon";
  return "Night";
};

export const isValidTimeZone = (timeZone) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
};
