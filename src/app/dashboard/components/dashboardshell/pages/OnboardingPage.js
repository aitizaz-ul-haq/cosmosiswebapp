"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useDashboardPageLoading } from "./loading/DashboardPageLoading";
import "./onboarding/onboarding.css";
import { PHASE_CONFIG } from "./clientStatusShared";
import OnboardingTimeline from "./onboarding/OnboardingTimeline";
import PhaseDetails from "./onboarding/PhaseDetails";
import PhaseModal from "./onboarding/PhaseModal";
import PrerequisitesModal from "./onboarding/PrerequisitesModal";
import Phase1PersonalDetails from "./onboarding/phases/Phase1PersonalDetails";
import Phase2SourceOfWealth from "./onboarding/phases/Phase2SourceOfWealth";
import Phase3FinancialProfile from "./onboarding/phases/Phase3FinancialProfile";
import Phase4RiskProfile from "./onboarding/phases/Phase4RiskProfile";
import Phase5Signature from "./onboarding/phases/Phase5Signature";
import Phase6DocumentationChecklist from "./onboarding/phases/Phase6DocumentationChecklist";

// Phase 0 keeps its existing read-only document reader.
const PREREQUISITES_PHASE = { id: 0, name: "Prerequisites" };
const PHASE_COMPONENTS = {
  1: Phase1PersonalDetails,
  2: Phase2SourceOfWealth,
  3: Phase3FinancialProfile,
  4: Phase4RiskProfile,
  5: Phase5Signature,
  6: Phase6DocumentationChecklist,
};
const PHASES = PHASE_CONFIG.map(({ phase, name }) => ({
  id: phase,
  name,
  Component: PHASE_COMPONENTS[phase],
}));
const TIMELINE_PHASES = [PREREQUISITES_PHASE, ...PHASES];

export default function OnboardingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [onboardingType, setOnboardingType] = useState("individual");
  const [onboarding, setOnboarding] = useState(null);
  const [profile, setProfile] = useState(null);
  const [assignedRm, setAssignedRm] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [openPhase, setOpenPhase] = useState(null);
  const [prerequisitesOpen, setPrerequisitesOpen] = useState(false);

  useDashboardPageLoading(loading);

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
          setAssignedRm(data.assignedRm || null);
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

  const selectPhase = (id) => {
    if (id === PREREQUISITES_PHASE.id) {
      setPrerequisitesOpen(true);
      return;
    }
    setExpandedPhase((current) => (current === id ? null : id));
  };

  const startPhase = (id) => {
    setExpandedPhase(id);
    setOpenPhase(id);
  };

  const closePhase = () => {
    setOpenPhase(null);
    requestAnimationFrame(() => document.getElementById(`onb-start-phase-${openPhase}`)?.focus());
  };

  if (loading) {
    return (
      <div className="onb-wrap onb-client-onboarding">
        <div className="onb-container">
          <div className="onb-loading">Loading your onboarding…</div>
        </div>
      </div>
    );
  }

  if (onboardingType !== "individual") {
    return (
      <div className="onb-wrap onb-client-onboarding">
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

  const companyName = profile?.companyName || user?.companyName;
  const currentStep = onboarding?.currentStep || 1;
  const completedPhases = new Set((onboarding?.completedSteps || []).map(Number));
  const formSubmitted = ["submitted", "approved"].includes(onboarding?.status);
  // Viewing/starting a phase does not count as submitting it. Prerequisites
  // have no saved read state, so completed form phases are evidence they were read.
  const isPhaseSubmitted = (id) => formSubmitted || completedPhases.has(id)
    || (id === 0 && completedPhases.size > 0);
  const activePhase = PHASES.find((phase) => phase.id === openPhase);
  const ActiveComponent = activePhase?.Component;

  return (
    <div className="onb-wrap onb-client-onboarding">
      <div className="onb-container">
        {/* Brand logo in the bottom-right corner */}
        <img
          className="onb-brand-logo"
          src="/images/cosmosis_logo_dark_dashboard.png"
          alt="Cosmosis"
          aria-hidden="true"
        />
        {/* Onboarding progress card with timeline */}
        <div className="onb-progress-card">
          <h2 className="onb-card-heading">Onboarding Progress</h2>
          <p className="onb-card-sub">
            Select a phase below to view its sections.
          </p>
          <OnboardingTimeline
            phases={TIMELINE_PHASES}
            activePhase={currentStep}
            expandedPhase={expandedPhase}
            onSelect={selectPhase}
            isPhaseSubmitted={isPhaseSubmitted}
          />
        </div>

        {PHASES.map((phase) => (
          <PhaseDetails
            key={phase.id}
            phase={phase}
            expanded={expandedPhase === phase.id}
            submitted={isPhaseSubmitted(phase.id)}
            assignedRm={assignedRm}
            onStart={startPhase}
          />
        ))}
      </div>

      {prerequisitesOpen && (
        <PrerequisitesModal
          companyName={companyName}
          onClose={() => setPrerequisitesOpen(false)}
        />
      )}

      {activePhase && ActiveComponent && (
        <PhaseModal
          id={activePhase.id}
          name={activePhase.name}
          totalPhases={PHASES.length}
          onClose={closePhase}
          onNext={startPhase}
        >
          <ActiveComponent companyName={companyName} />
        </PhaseModal>
      )}
    </div>
  );
}
