import { PHASE_CONFIG, PHASE_SECTIONS } from "../clientStatusShared";

// TEMPORARY: placeholder submissions so the Submissions UI can be tested.
// Replace with real submitted phase data once it is available from the API.
const DAY_MS = 24 * 60 * 60 * 1000;

const formatDateTime = (date) =>
  date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Phases before the client's current one are completed. The current phase is only partly done:
// roughly half of its sub-sections are submitted and it has no completion time yet.
export function buildDummySubmissions(client) {
  if ((client.onboardingType || "individual") !== "individual") return [];

  const reached = Math.min(
    Math.max(Number(client?.onboarding?.currentStep) || 1, 1),
    PHASE_CONFIG.length
  );
  const start = new Date(client.createdAt || Date.now()).getTime();
  const now = Date.now();

  return PHASE_CONFIG.slice(0, reached).map(({ phase, name }) => {
    const completed = phase < reached;
    const allSections = PHASE_SECTIONS[phase] || [];
    const doneSections = completed
      ? allSections
      : allSections.slice(0, Math.ceil(allSections.length / 2));
    const submittedAt = new Date(Math.min(start + phase * DAY_MS, now));
    const submittedOn = formatDateTime(submittedAt);
    return {
      phase,
      name,
      completed,
      completedAt: completed ? submittedAt.toISOString() : null,
      totalSections: allSections.length,
      sections: doneSections.map((title) => ({
        title,
        fields: [
          { label: "Status", value: "Submitted" },
          { label: "Submitted on", value: submittedOn },
          { label: "Details", value: "Sample data for UI testing" },
        ],
      })),
    };
  });
}
