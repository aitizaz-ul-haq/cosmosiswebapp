const isValidTimeZone = (timeZone) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
};

// Validates a schedule request body; returns { error } or the cleaned values.
export function parseSchedule(body) {
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const country = str(body.country).slice(0, 100);
  const city = str(body.city).slice(0, 100);
  const timeZone = str(body.timeZone);
  if (!country || !city || !isValidTimeZone(timeZone)) {
    return { error: "A valid country, city and time zone are required" };
  }
  const scheduledAt = new Date(body.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
    return { error: "Please choose a date and time in the future" };
  }
  return { country, city, timeZone, scheduledAt };
}
