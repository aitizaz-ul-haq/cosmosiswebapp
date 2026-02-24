"use client";

import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import "../styles/rmdashboard.css";

export default function RMDashboard() {
  const { user } = useUser();
  const [clientCount, setClientCount] = useState(0);
  const [ongoingOnboarding, setOngoingOnboarding] = useState(0);
  const [completedOnboarding, setCompletedOnboarding] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch clients assigned to this RM (same as ClientsPage does)
        const clientRes = await fetch("/api/clients", {
          credentials: "include",
          cache: "no-store",
        });

        const clientData = await clientRes.json().catch(() => ({}));
        
        if (!clientRes.ok) {
          console.error("Failed to fetch clients:", clientData?.error);
          setClientCount(0);
        } else {
          const clients = clientData.clients || [];
          console.log("RM Dashboard: Fetched clients:", clients.length, clients);
          setClientCount(clients.length);
        }

        // Set placeholder random values for other cards (to be implemented later)
        setOngoingOnboarding(Math.floor(Math.random() * 10) + 1);
        setCompletedOnboarding(Math.floor(Math.random() * 15) + 5);
        setSubmissions(Math.floor(Math.random() * 20) + 10);
      } catch (err) {
        console.error("Error fetching counts:", err);
        setError("Failed to load dashboard data");
        setClientCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [user]);

  const onboardingSteps = [
    { client: "John Anderson", label: "Personal Details", percentage: 20 },
    { client: "Sarah Mitchell", label: "Source of Wealth", percentage: 35 },
    { client: "Michael Chen", label: "Financial Profile", percentage: 50 },
    { client: "Emma Williams", label: "Risk Profile", percentage: 65 },
    { client: "David Martinez", label: "Signature", percentage: 80 },
    { client: "Lisa Thompson", label: "Documentation Checklist", percentage: 100 },
  ];

  return (
    <div className="rm-dashboard-container">
      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-stat-cards">
        <div className="stat-card clients-card">
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
            <h2 className="stat-card-label">Ongoing Onboardings</h2>
          </div>
          <div className="stat-card-value">{ongoingOnboarding}</div>
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
            <h2 className="stat-card-label">Completed Onboardings</h2>
          </div>
          <div className="stat-card-value">{completedOnboarding}</div>
        </div>

        <div className="stat-card submissions-card">
          <div className="stat-card-header">
            <svg
              className="stat-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <h2 className="stat-card-label">Submissions</h2>
          </div>
          <div className="stat-card-value">{submissions}</div>
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
