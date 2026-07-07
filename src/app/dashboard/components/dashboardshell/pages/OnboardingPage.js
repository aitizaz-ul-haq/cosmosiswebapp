"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import "./onboarding/onboarding.css";
import OnboardingTimeline from "./onboarding/OnboardingTimeline";
import PhaseModal from "./onboarding/PhaseModal";
import Phase1PersonalDetails from "./onboarding/phases/Phase1PersonalDetails";
import Phase2SourceOfWealth from "./onboarding/phases/Phase2SourceOfWealth";
import Phase3FinancialProfile from "./onboarding/phases/Phase3FinancialProfile";
import Phase4RiskProfile from "./onboarding/phases/Phase4RiskProfile";
import Phase5Signature from "./onboarding/phases/Phase5Signature";
import Phase6DocumentationChecklist from "./onboarding/phases/Phase6DocumentationChecklist";

const PHASES = [
  { id: 1, name: "Personal Details", Component: Phase1PersonalDetails },
  { id: 2, name: "Source of Wealth", Component: Phase2SourceOfWealth },
  { id: 3, name: "Financial Profile", Component: Phase3FinancialProfile },
  { id: 4, name: "Risk Profile", Component: Phase4RiskProfile },
  { id: 5, name: "Signature", Component: Phase5Signature },
  { id: 6, name: "Documentation Checklist", Component: Phase6DocumentationChecklist },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [onboardingType, setOnboardingType] = useState("individual");
  const [onboarding, setOnboarding] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activePhase, setActivePhase] = useState(1);
  const [openPhase, setOpenPhase] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/clients/me", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        // If we can read a valid type, use it; otherwise fall back to
        // "individual" so the form is always visible during onboarding.
        if (res.ok && data.success && data.onboardingType) {
          setOnboardingType(data.onboardingType);
          setOnboarding(data.onboarding || null);
          setProfile(data.profile || null);
        } else {
          setOnboardingType("individual");
        }
      } catch (err) {
        if (!cancelled) setOnboardingType("individual");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openPhaseModal = (id) => {
    setActivePhase(id);
    setOpenPhase(id);
  };

  const goToPhase = (id) => {
    setActivePhase(id);
    setOpenPhase(id);
  };

  if (loading) {
    return (
      <div className="onb-wrap">
        <div className="onb-container">
          <div className="onb-loading">Loading your onboarding…</div>
        </div>
      </div>
    );
  }

  if (onboardingType !== "individual") {
    return (
      <div className="onb-wrap">
        <div className="onb-container">
          <h1 className="onb-heading">Client Onboarding</h1>
          <div className="onb-message">
            Onboarding for the <strong>{onboardingType}</strong> account type is
            coming soon.
          </div>
        </div>
      </div>
    );
  }

  const activePhaseObj = PHASES.find((p) => p.id === openPhase);
  const ActiveComponent = activePhaseObj?.Component;

  // Derived summary values for the stat cards.
  const STATUS_LABELS = {
    not_started: "Not Started",
    in_progress: "In Progress",
    submitted: "Submitted",
    approved: "Approved",
    rejected: "Rejected",
  };
  const rawStatus = onboarding?.status || "in_progress";
  const statusLabel = STATUS_LABELS[rawStatus] || "In Progress";
  const currentStep = onboarding?.currentStep || 1;
  const currentPhase = PHASES.find((p) => p.id === currentStep) || PHASES[0];
  const completedCount = Array.isArray(onboarding?.completedSteps)
    ? onboarding.completedSteps.length
    : 0;
  const isSubmitted = ["submitted", "approved"].includes(rawStatus);

  // Client name for the greeting: prefer the account holder's forenames,
  // then their full name, otherwise fall back to the account username.
  const holder1 = profile?.accountHolders?.holder1;
  const clientName =
    holder1?.forenames?.trim() ||
    holder1?.surname?.trim() ||
    user?.username ||
    "there";

  return (
    <div className="onb-wrap">
      <div className="onb-container">
        {/* Brand logo in the bottom-right corner */}
        <img
          className="onb-brand-logo"
          src="/images/cosmosis_logo_dark_dashboard.png"
          alt="Cosmosis"
          aria-hidden="true"
        />
        {/* Header: heading + description + illustration */}
        <div className="onb-header">
          <div className="onb-header-text">
            <h1 className="onb-heading">Welcome {clientName}</h1>
            <p className="onb-subheading">
              Complete your onboarding in guided phases. Each section collects the
              information required to review your profile, prepare your account
              documentation, and support final approval. You can save your
              progress and return at any time before submission.
            </p>
          </div>
          <div className="onb-header-illustration" aria-hidden="true">
            <OnboardingIllustration />
          </div>
        </div>

        {/* Stat cards */}
        <div className="onb-stats">
          <StatCard
            icon="📈"
            label="Status"
            value={statusLabel}
            desc="Your onboarding is currently in progress."
          />
          <StatCard
            icon="🚩"
            label="Current Phase"
            value={currentPhase.name}
            desc="Complete this phase to continue."
          />
          <StatCard
            icon="📊"
            label="Completion"
            value={`${completedCount} of ${PHASES.length} Phases`}
            desc={`You have completed ${completedCount} phase${
              completedCount === 1 ? "" : "s"
            } so far.`}
          />
          <StatCard
            icon="📅"
            label="Last Updated"
            value={isSubmitted ? "Submitted" : "Not Submitted Yet"}
            desc="Save your progress and submit when complete."
          />
        </div>

        {/* Onboarding progress card with timeline */}
        <div className="onb-progress-card">
          <h2 className="onb-card-heading">Onboarding Progress</h2>
          <p className="onb-card-sub">
            Select a phase below to review or complete the required information.
          </p>
          <OnboardingTimeline
            phases={PHASES}
            activePhase={currentStep}
            onSelect={openPhaseModal}
          />
        </div>

        {/* Before You Begin info box */}
        <div className="onb-info-box">
          <span className="onb-info-icon">i</span>
          <div>
            <h3 className="onb-info-title">Before You Begin</h3>
            <p className="onb-info-text">
              Please ensure your personal, financial, and identification
              information is accurate and up to date. You may complete the phases
              in order and save your progress as you go. Once all phases are
              completed, your submission will be reviewed by the onboarding team.
            </p>
          </div>
        </div>
      </div>

      {activePhaseObj && ActiveComponent && (
        <PhaseModal
          id={activePhaseObj.id}
          name={activePhaseObj.name}
          totalPhases={PHASES.length}
          onClose={() => setOpenPhase(null)}
          onNext={goToPhase}
        >
          <ActiveComponent />
        </PhaseModal>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, desc }) {
  return (
    <div className="onb-stat-card">
      <div className="onb-stat-icon">{icon}</div>
      <div className="onb-stat-body">
        <span className="onb-stat-label">{label}</span>
        <span className="onb-stat-value">{value}</span>
        <span className="onb-stat-desc">{desc}</span>
      </div>
    </div>
  );
}

function OnboardingIllustration() {
  return (
    <svg
      width="220"
      height="150"
      viewBox="0 0 220 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="120" cy="80" rx="100" ry="60" fill="#EAF8F4" />
      <rect x="70" y="30" width="70" height="90" rx="8" fill="#fff" stroke="#3A4A8C" strokeWidth="3" />
      <rect x="92" y="24" width="26" height="12" rx="3" fill="#3A4A8C" />
      <circle cx="84" cy="52" r="5" fill="#21CFB2" />
      <circle cx="84" cy="72" r="5" fill="#21CFB2" />
      <circle cx="84" cy="92" r="5" fill="#21CFB2" />
      <rect x="96" y="49" width="34" height="5" rx="2.5" fill="#C7D0E8" />
      <rect x="96" y="69" width="34" height="5" rx="2.5" fill="#C7D0E8" />
      <rect x="96" y="89" width="34" height="5" rx="2.5" fill="#C7D0E8" />
      <rect x="132" y="70" width="60" height="46" rx="6" fill="#F1F4FB" stroke="#C7D0E8" strokeWidth="2" />
      <circle cx="150" cy="88" r="9" fill="#8FA0C8" />
      <rect x="164" y="82" width="22" height="4" rx="2" fill="#C7D0E8" />
      <rect x="164" y="92" width="18" height="4" rx="2" fill="#C7D0E8" />
      <path d="M186 96c0-9 7-16 16-16s16 7 16 16-7 16-16 16a16 16 0 0 1-16-16Z" fill="#21CFB2" />
      <path d="M197 96l4 4 7-7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
