"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import "./onboarding/onboarding.css";
import OnboardingTimeline from "./onboarding/OnboardingTimeline";
import PhaseModal from "./onboarding/PhaseModal";
import PrerequisitesModal from "./onboarding/PrerequisitesModal";
import Phase1PersonalDetails from "./onboarding/phases/Phase1PersonalDetails";
import Phase2SourceOfWealth from "./onboarding/phases/Phase2SourceOfWealth";
import Phase3FinancialProfile from "./onboarding/phases/Phase3FinancialProfile";
import Phase4RiskProfile from "./onboarding/phases/Phase4RiskProfile";
import Phase5Signature from "./onboarding/phases/Phase5Signature";
import Phase6DocumentationChecklist from "./onboarding/phases/Phase6DocumentationChecklist";

// Phase 0 (prerequisites) is read-only and has its own modal, so it has no form Component.
const PREREQUISITES_PHASE = { id: 0, name: "Prerequisites" };

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

  const TIMELINE_PHASES = [PREREQUISITES_PHASE, ...PHASES];
  const companyName = profile?.companyName || user?.companyName;
  const activePhaseObj = PHASES.find((p) => p.id === openPhase);
  const ActiveComponent = activePhaseObj?.Component;

  const currentStep = onboarding?.currentStep || 1;

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
        {/* Onboarding progress card with timeline */}
        <div className="onb-progress-card">
          <h2 className="onb-card-heading">Onboarding Progress</h2>
          <p className="onb-card-sub">
            Select a phase below to review or complete the required information.
          </p>
          <OnboardingTimeline
            phases={TIMELINE_PHASES}
            activePhase={currentStep}
            onSelect={openPhaseModal}
          />
        </div>
      </div>

      {openPhase === PREREQUISITES_PHASE.id && (
        <PrerequisitesModal
          companyName={companyName}
          onClose={() => setOpenPhase(null)}
        />
      )}

      {activePhaseObj && ActiveComponent && (
        <PhaseModal
          id={activePhaseObj.id}
          name={activePhaseObj.name}
          totalPhases={PHASES.length}
          onClose={() => setOpenPhase(null)}
          onNext={goToPhase}
        >
          <ActiveComponent companyName={companyName} />
        </PhaseModal>
      )}
    </div>
  );
}
