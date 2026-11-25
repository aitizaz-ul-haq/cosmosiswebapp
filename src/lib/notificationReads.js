const EVENT_DATE_FIELDS = Object.freeze({
  created: "createdAt",
  submitted: "onboarding.submittedAt",
  approved: "onboarding.approvedAt",
});

export const isNotificationObjectId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

// Include the source timestamp so another submission of the same client's
// application is a new notification, independent of an earlier read receipt.
export function notificationEventKey(profileId, eventType, eventDate) {
  if (!isNotificationObjectId(profileId) || typeof eventType !== "string" || !Object.prototype.hasOwnProperty.call(EVENT_DATE_FIELDS, eventType)) return null;
  if (!(eventDate instanceof Date) && typeof eventDate !== "string") return null;
  const date = new Date(eventDate);
  if (!Number.isFinite(date.getTime())) return null;
  return `${profileId.toLowerCase()}:${eventType}:${date.toISOString()}`;
}

export function notificationSourceDate(profile, eventType) {
  if (typeof eventType !== "string") return null;
  const field = EVENT_DATE_FIELDS[eventType];
  if (!Object.prototype.hasOwnProperty.call(EVENT_DATE_FIELDS, eventType)) return null;
  return field.split(".").reduce((value, part) => value?.[part], profile) ?? null;
}

export function validateNotificationReadInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)
    || Object.keys(body).some((field) => !["profileId", "eventType", "eventDate"].includes(field))) return null;
  const { profileId, eventType, eventDate } = body;
  if (typeof eventDate !== "string" || eventDate.length !== 24) return null;
  const key = notificationEventKey(profileId, eventType, eventDate);
  if (!key || new Date(eventDate).toISOString() !== eventDate) return null;
  return { profileId: profileId.toLowerCase(), eventType, eventDate, key };
}

export function notificationClientScope(user, profileId) {
  return {
    ...(profileId ? { _id: profileId } : {}),
    companyId: user.companyId,
    ...(user.role === "rm" ? { $or: [{ assignedToUserId: user.id }, { sharedWithUserIds: user.id }] } : {}),
  };
}
