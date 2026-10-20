// Dashboard summaries use only the client data visible to the signed-in user.
export const DASHBOARD_PHASES = [
  { id: 1, label: "Personal Details" },
  { id: 2, label: "Source of Wealth" },
  { id: 3, label: "Financial Profile" },
  { id: 4, label: "Risk Profile" },
  { id: 6, label: "Documentation" },
  { id: 5, label: "Signature" },
];

export const clientId = (client) => String(client.profileId || client.userId || client._id || "");
export const clientName = (client) => client.fullName || client.username || "Client";
export const clientCompleted = (client) => client.onboarding?.status === "approved";
export const clientUnderReview = (client) =>
  client.status === "under_review" || client.onboarding?.status === "submitted";
export const clientInProgress = (client) =>
  !clientCompleted(client) && !clientUnderReview(client) && client.status === "ongoing" &&
  (client.onboarding?.status === "in_progress" || (client.onboarding?.completedSteps || []).length > 0);

export function filterClients(clients, filter) {
  if (filter === "in_progress") return clients.filter(clientInProgress);
  if (filter === "completed") return clients.filter(clientCompleted);
  if (filter === "under_review") return clients.filter(clientUnderReview);
  return clients;
}

export function validDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value, withTime = false, timeZone) {
  const date = validDate(value);
  if (!date) return "—";
  const options = { month: "short", day: "numeric", year: "numeric" };
  if (withTime) Object.assign(options, { hour: "numeric", minute: "2-digit", second: "2-digit" });
  if (timeZone) options.timeZone = timeZone;
  try { return date.toLocaleString("en-US", options); }
  catch { delete options.timeZone; return date.toLocaleString("en-US", options); }
}

export function scheduleParts(client) {
  const date = validDate(client.scheduledRegistrationAt);
  if (!date) return { month: "—", day: "—", time: "Time not set" };
  const timeZone = client.scheduledTimeZone || undefined;
  try {
    return {
      month: date.toLocaleDateString("en-US", { month: "short", timeZone }).toUpperCase(),
      day: date.toLocaleDateString("en-US", { day: "numeric", timeZone }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone }),
    };
  } catch {
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: String(date.getDate()),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
  }
}

export function relativeTime(value) {
  const date = validDate(value);
  if (!date) return "";
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 0) return formatDate(value);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(value);
}

export function phaseValues(client, phaseId) {
  const onboarding = client.onboarding || {};
  if (onboarding.status === "approved") return [1, 0, 0, 0];
  if (onboarding.status === "submitted") return [0, 0, 1, 0];
  if ((onboarding.completedSteps || []).map(Number).includes(phaseId)) return [1, 0, 0, 0];
  if (Number(onboarding.currentStep) === phaseId && onboarding.status === "in_progress") return [0, 1, 0, 0];
  return [0, 0, 0, 1];
}

export function phaseBars(clients) {
  return DASHBOARD_PHASES.map((phase) => ({
    label: phase.label === "Source of Wealth" ? ["Source of", "Wealth"] : phase.label.split(" "),
    values: clients.reduce((total, client) => phaseValues(client, phase.id).map((count, index) => total[index] + count), [0, 0, 0, 0]),
  }));
}

export function clientBars(clients) {
  const priority = (client) => {
    if (clientInProgress(client)) return 0;
    if (client.onboarding?.status === "submitted") return 1;
    if (clientCompleted(client)) return 2;
    if (client.status === "ongoing") return 3;
    return client.status === "scheduled" ? 5 : 4;
  };
  return [...clients].sort((a, b) => priority(a) - priority(b)).slice(0, 4).map((client) => ({
    label: clientName(client), sublabel: "6 phases",
    values: DASHBOARD_PHASES.reduce((total, phase) => phaseValues(client, phase.id).map((count, index) => total[index] + count), [0, 0, 0, 0]),
  }));
}

export function submissionRows(clients) {
  return clients
    .filter((client) => (client.onboarding?.completedSteps || []).length > 0 || ["submitted", "approved"].includes(client.onboarding?.status))
    .map((client) => {
      const onboarding = client.onboarding || {};
      const completedSteps = (onboarding.completedSteps || []).map(Number);
      const phase = DASHBOARD_PHASES.find((item) => item.id === Math.max(...completedSteps, 1));
      const status = onboarding.status === "approved" ? "Completed" : onboarding.status === "submitted" ? "Under Review" : "Submitted";
      return {
        id: clientId(client), name: clientName(client), company: client.companyName || "—",
        manager: client.assignedToName || "—",
        title: `${String(client.onboardingType || "individual").replace(/^./, (letter) => letter.toUpperCase())} Account Application`,
        stage: onboarding.status === "submitted" || onboarding.status === "approved" ? "Final Review" : phase?.label || "—",
        date: onboarding.submittedAt || onboarding.approvedAt || null, status,
        tone: status === "Under Review" ? "violet" : "green",
      };
    })
    .sort((a, b) => (validDate(b.date)?.getTime() || 0) - (validDate(a.date)?.getTime() || 0));
}

export function clientEvents(clients) {
  return clients.flatMap((client) => {
    const id = clientId(client), name = clientName(client), events = [];
    if (validDate(client.createdAt)) events.push({
      id: `${id}-created`, name, date: client.createdAt, title: "New client added", activity: "Client Added",
      description: `${name} was added to your client list`, details: "Client onboarding created", status: "Assigned", tone: "green", icon: "users", menu: "clients",
    });
    if (validDate(client.onboarding?.submittedAt)) events.push({
      id: `${id}-submitted`, name, date: client.onboarding.submittedAt, title: "Application submitted", activity: "Submission",
      description: `${name} submitted their onboarding application`, details: "Application submitted for review", status: "Under Review", tone: "violet", icon: "file", menu: "submissions",
    });
    if (validDate(client.onboarding?.approvedAt)) events.push({
      id: `${id}-approved`, name, date: client.onboarding.approvedAt, title: "Onboarding completed", activity: "Approval",
      description: `${name}'s onboarding was approved`, details: "Onboarding application approved", status: "Completed", tone: "green", icon: "checkCircle", menu: "onboardingstatus",
    });
    return events;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function managerClients(clients, manager) {
  const managerId = String(manager._id || manager.id || "");
  return clients.filter((client) => {
    const assignedId = client.assignedToUserId?._id || client.assignedToUserId;
    return String(assignedId || "") === managerId || (client.sharedWithUserIds || []).map(String).includes(managerId);
  });
}

export function withinPeriod(value, period) {
  if (period === "all") return true;
  const date = validDate(value);
  if (!date) return false;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (period === "last_month" ? 1 : 0), 1);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  return date >= start && date < end;
}

export function monthlyTrend(dates) {
  const current = dates.filter((date) => withinPeriod(date, "this_month")).length;
  const previous = dates.filter((date) => withinPeriod(date, "last_month")).length;
  return previous ? Math.round(((current - previous) / previous) * 100) : undefined;
}
