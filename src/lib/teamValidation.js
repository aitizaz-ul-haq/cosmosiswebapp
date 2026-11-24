export function isTeamObjectId(value) {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
}

export function normalizeTeamName(name) {
  return name.trim().normalize("NFKC").toLowerCase();
}

// Validate both complete forms and partial edits without accepting tenant or
// ownership fields from the browser. Role/tenant membership is checked by the API.
export function validateTeamInput(input, { partial = false } = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: "A valid team form is required." };
  }
  const allowed = ["name", "leaderUserId", "memberUserIds"];
  const keys = Object.keys(input);
  if (keys.some((key) => !allowed.includes(key))) {
    return { error: "Only team name, team leader and team members may be provided." };
  }
  if (partial && keys.length === 0) {
    return { error: "Provide at least one team field to update." };
  }

  const value = {};
  if (!partial || Object.hasOwn(input, "name")) {
    if (typeof input.name !== "string" || !input.name.trim() || input.name.trim().length > 120) {
      return { error: "Team name must contain between 1 and 120 characters." };
    }
    value.name = input.name.trim();
    value.nameKey = normalizeTeamName(value.name);
  }
  if (!partial || Object.hasOwn(input, "leaderUserId")) {
    if (!isTeamObjectId(input.leaderUserId)) {
      return { error: "Select a valid Investment Manager as the team leader." };
    }
    value.leaderUserId = input.leaderUserId.toLowerCase();
  }
  if (!partial || Object.hasOwn(input, "memberUserIds")) {
    if (!Array.isArray(input.memberUserIds) || input.memberUserIds.length === 0) {
      return { error: "Select at least one team member." };
    }
    if (input.memberUserIds.some((id) => !isTeamObjectId(id))) {
      return { error: "Select valid Investment Managers as team members." };
    }
    value.memberUserIds = input.memberUserIds.map((id) => id.toLowerCase());
    if (new Set(value.memberUserIds).size !== value.memberUserIds.length) {
      return { error: "Each team member can only be selected once." };
    }
  }
  if (value.leaderUserId && value.memberUserIds?.includes(value.leaderUserId)) {
    return { error: "The team leader cannot also be selected as a team member." };
  }
  return { value };
}
