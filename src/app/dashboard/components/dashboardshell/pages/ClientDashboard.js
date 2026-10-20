"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { PHASE_CONFIG } from "./clientStatusShared";
import { ActionList, ActivityTable, Badge, DashboardHero, DonutProgress, EmptyState, Icon, Panel, StatCard } from "./dashboard/DashboardUI";

const STATUS_LABELS = {
  not_started: "Not Started", in_progress: "In Progress", submitted: "Under Review", approved: "Approved", rejected: "Changes Required",
};

function formatDate(value, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function profileCompletion(holder) {
  if (!holder) return 0;
  const fields = [
    holder.forenames, holder.surname, holder.dateOfBirth, holder.email,
    holder.mobile || holder.homeTelephone, holder.nationality,
    holder.residentialAddress?.line1, holder.residentialAddress?.city,
    holder.residentialAddress?.postalCode, holder.residentialAddress?.country,
  ];
  return Math.round((fields.filter((value) => String(value || "").trim()).length / fields.length) * 100);
}

export default function ClientDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/clients/me", {
          credentials: "include", cache: "no-store",
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) throw new Error(data.error || "Unable to load your dashboard.");
        if (active) setProfile(data.profile ? { ...data.profile, onboarding: data.onboarding || data.profile.onboarding } : null);
      } catch (err) {
        if (active && err?.name !== "AbortError") setError(err?.message || "Unable to load your dashboard.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const onboarding = profile?.onboarding;
  const rawStatus = onboarding?.status || "not_started";
  const currentStep = Math.min(Math.max(Math.trunc(Number(onboarding?.currentStep)) || 1, 1), PHASE_CONFIG.length);
  const currentPhase = PHASE_CONFIG[currentStep - 1];
  const submitted = ["submitted", "approved"].includes(rawStatus);
  const completedSteps = new Set((onboarding?.completedSteps || []).map(Number).filter((step) => step >= 1 && step <= PHASE_CONFIG.length));
  const completedCount = submitted ? PHASE_CONFIG.length : completedSteps.size;
  const savedProgress = onboarding?.progress == null || onboarding.progress === "" ? null : Number(onboarding.progress);
  const progress = submitted ? 100 : Math.min(Math.max(savedProgress != null && Number.isFinite(savedProgress) ? savedProgress : rawStatus === "in_progress" ? currentPhase.pct : 0, 0), 100);
  const holder = profile?.accountHolders?.holder1;
  const clientName = holder?.forenames?.trim() || user?.fullName?.trim()?.split(/\s+/)[0] || user?.username || "there";
  const completion = profileCompletion(holder);
  const goTo = (menu) => router.push(`/dashboard?menu=${menu}`);
  const unavailable = loading ? "…" : "—";
  const pendingActions = [];

  if (profile && !submitted) {
    if (!profile.documents?.utilityBillUploaded) pendingActions.push({
      title: "Upload Proof of Address", description: "Provide a recent utility bill or bank statement",
      icon: "document", tone: "teal", onClick: () => goTo("onboarding"),
    });
    if (!completedSteps.has(currentStep)) pendingActions.push({
      title: `Complete ${currentPhase.name}${currentStep === 2 ? " Questionnaire" : ""}`,
      description: "Complete the remaining requirements to continue",
      icon: "userPlus", tone: "violet", onClick: () => goTo("onboarding"),
    });
    if (!profile.documents?.passportUploaded) pendingActions.push({
      title: "Upload ID Document", description: "Provide a valid passport or national ID",
      icon: "document", tone: "slate", onClick: () => goTo("onboarding"),
    });
    if (!completedSteps.has(5) && currentStep !== 5) pendingActions.push({
      title: "Review and Sign Declarations", description: "Read and sign the client agreements",
      icon: "pen", tone: "violet", onClick: () => goTo("onboarding"),
    });
  }

  const recentUploads = [...(profile?.documents?.uploads || [])]
    .sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0)).slice(0, 4);

  return (
    <div className="dsh-dashboard dsh-dashboard--client">
      <DashboardHero
        title={`Welcome back, ${clientName}`}
        subtitle="Track your onboarding progress, complete outstanding tasks, and submit required documents."
        tagline="Your onboarding journey to greater possibilities."
      />
      {error && <div className="dsh-error" role="alert">{error}</div>}
      <div className="dsh-stats">
        <StatCard label="Onboarding Status" value={profile ? STATUS_LABELS[rawStatus] || rawStatus : unavailable} icon="trend" tone="teal"
          description={profile ? rawStatus === "approved" ? "Your onboarding has been approved." : submitted ? "Your onboarding has been submitted for review." : `You are currently in the ${currentPhase.name} phase.` : "Your onboarding status will appear here."} sparkline={false} />
        <StatCard label="Current Phase" value={profile ? submitted ? "All Phases Complete" : currentPhase.name : unavailable} icon="flag"
          description={submitted ? "All onboarding phases have been completed." : "Complete the remaining requirements to continue."} sparkline={false} />
        <StatCard label="Overall Completion" value={profile ? `${completedCount} of ${PHASE_CONFIG.length} Phases` : unavailable} tone="teal"
          description={`You have completed ${completedCount} phase${completedCount === 1 ? "" : "s"} so far.`} sparkline={false}>
          <DonutProgress value={progress} size={100} />
        </StatCard>
        <StatCard label="Last Updated" value={profile ? formatDate(profile.updatedAt) : unavailable} icon="calendar"
          description={profile?.updatedAt ? "Your most recent saved onboarding progress." : "Save your progress to update your onboarding."} sparkline={false} />
      </div>

      <div className="dsh-client-grid dsh-row-top">
        <Panel title="Onboarding Phase Progress" icon="chart" action={<button type="button" data-log-title="Client dashboard: view all onboarding phases" className="dsh-text-button" onClick={() => goTo("onboarding")}>View all phases</button>}>
          <div className="dsh-phase-list" aria-label="Onboarding phase progress">
            {PHASE_CONFIG.map((phase) => {
              const done = submitted || completedSteps.has(phase.phase);
              const active = Boolean(profile) && !done && rawStatus !== "not_started" && phase.phase === currentStep;
              const percent = done ? 100 : active ? progress : 0;
              return (
                <div className={`dsh-phase-row ${done ? "is-complete" : active ? "is-current" : ""}`} key={phase.phase}>
                  <span className="dsh-phase-number">{phase.phase}</span>
                  <span className="dsh-phase-name">{phase.name}</span>
                  <div className="dsh-phase-track" role="progressbar" aria-label={phase.name} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                    <span className="dsh-phase-fill" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="dsh-phase-percent">{percent}%</span>
                  <Badge tone={done || active ? "green" : "slate"}>{done ? "Completed" : active ? "In Progress" : "Not Started"}</Badge>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="Pending Actions" icon="lightning" action={<button type="button" data-log-title="Client dashboard: view pending onboarding actions" className="dsh-text-button" onClick={() => goTo("onboarding")}>View all</button>}>
          {pendingActions.length > 0 ? <ActionList items={pendingActions.slice(0, 4)} /> : <EmptyState>{loading ? "Loading your pending actions…" : submitted ? "All requirements have been submitted." : error ? "Pending actions are unavailable." : "You are all caught up."}</EmptyState>}
        </Panel>
      </div>

      <div className="dsh-client-grid dsh-row-bottom">
        <Panel title="Recent Submissions" icon="clock" action={<button type="button" data-log-title="Client dashboard: view all submissions" className="dsh-text-button" onClick={() => goTo("submissions")}>View all submissions</button>}>
          <ActivityTable columns={[
            { key: "uploadedAt", label: "Date & Time", render: (value) => formatDate(value, true) },
            { key: "label", label: "Document Name", render: (value) => value || "Supporting Document" },
            { key: "type", label: "Type", render: () => "Onboarding Document" },
            { key: "status", label: "Status", render: () => <Badge tone="teal">Uploaded</Badge> },
          ]} rows={recentUploads} emptyMessage={loading ? "Loading your submissions…" : error ? "Submissions are unavailable." : "Your submitted documents will appear here."} />
        </Panel>
        <Panel title="Profile Completion" icon="user">
          <div className="dsh-profile-summary">
            <DonutProgress value={completion} size={110} />
            <div className="dsh-profile-copy"><span>Your Profile</span><strong>{completion}% Complete</strong><p>Complete your profile to help us process your application faster.</p></div>
          </div>
          <button type="button" data-log-title="Client dashboard: view profile" className="dsh-profile-button" onClick={() => goTo("profile")}>View Profile <Icon name="chevronRight" size={19} /></button>
        </Panel>
      </div>
    </div>
  );
}
