"use client";

import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import "../styles/supervisordashboard.css";

export default function SupervisorDashboard() {
  const { user } = useUser();
  const [rmCount, setRmCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [completedOnboarding, setCompletedOnboarding] = useState(0);
  const [ongoingOnboarding, setOngoingOnboarding] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.companyId) {
        setLoading(false);
        return;
      }

      try {
        const [rmRes, clientRes] = await Promise.all([
          fetch(
            `/api/users?role=rm&companyId=${user.companyId}&count=true`,
            { credentials: "include" }
          ),
          fetch(
            `/api/users?role=client&companyId=${user.companyId}&count=true`,
            { credentials: "include" }
          ),
        ]);

        if (rmRes.ok) {
          const rmData = await rmRes.json();
          setRmCount(rmData.count || 0);
        }

        if (clientRes.ok) {
          const clientData = await clientRes.json();
          setClientCount(clientData.count || 0);
        }

        // Set placeholder values for onboarding (will update later)
        setCompletedOnboarding(0);
        setOngoingOnboarding(0);
      } catch (err) {
        console.error("Error fetching counts:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [user?.companyId, user?.id]);

  const onboardingSteps = [
    { client: "John Anderson", label: "Personal Details", percentage: 20 },
    { client: "Sarah Mitchell", label: "Source of Wealth", percentage: 35 },
    { client: "Michael Chen", label: "Financial Profile", percentage: 50 },
    { client: "Emma Williams", label: "Risk Profile", percentage: 65 },
    { client: "David Martinez", label: "Signature", percentage: 80 },
    { client: "Lisa Thompson", label: "Documentation Checklist", percentage: 100 },
  ];

  return (
    <div className="supervisor-dashboard-container">
      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-stat-cards">
        <div className="stat-card rm-card">
          <div className="stat-card-header">
            <svg
              className="stat-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h2 className="stat-card-label">Relationship Managers</h2>
          </div>
          <div className="stat-card-value">{loading ? "..." : rmCount}</div>
        </div>

        <div className="stat-card client-card">
          <div className="stat-card-header">
            <svg
              className="stat-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            <h2 className="stat-card-label">Clients</h2>
          </div>
          <div className="stat-card-value">{loading ? "..." : clientCount}</div>
        </div>

        <div className="stat-card completed-card">
          <div className="stat-card-header">
            <svg
              className="stat-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <h2 className="stat-card-label">Completed Onboarding</h2>
          </div>
          <div className="stat-card-value">{completedOnboarding}</div>
        </div>

        <div className="stat-card ongoing-card">
          <div className="stat-card-header">
            <svg
              className="stat-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
            <h2 className="stat-card-label">Ongoing Onboarding</h2>
          </div>
          <div className="stat-card-value">{ongoingOnboarding}</div>
        </div>
      </div>

      <div className="onboarding-section">
        <h2 className="onboarding-title">Ongoing Onboarding Progress</h2>
        <div className="progress-bars-container">
          {onboardingSteps.map((step, index) => (
            <div key={index} className="progress-bar-item">
              <div className="progress-bar-label">
                <span className="progress-bar-name">{step.client} - {step.label}</span>
                <span className="progress-bar-percentage">{step.percentage}%</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${step.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
