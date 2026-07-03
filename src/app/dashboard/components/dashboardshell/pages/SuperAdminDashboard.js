"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/superadmindashboard.css";

// Human readable label for a log row's action (kept in sync with LogsPage)
function actionLabel(row) {
  const a = row?.action || "";
  switch (a) {
    case "login_success":
      return "Logged in";
    case "login_failed":
      return "Failed login attempt";
    case "logout":
      return "Logged out";
    default:
      break;
  }
  if (a === "button_click") {
    return row?.actionTitle ? `Clicked: ${row.actionTitle}` : "Clicked a control";
  }
  if (row?.actionTitle) return row.actionTitle;
  return a || "—";
}

function formatTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleTimeString();
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [companyCount, setCompanyCount] = useState(0);
  const [supervisorCount, setSupervisorCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [ongoingOnboarding] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [companyRes, supervisorRes, userRes] = await Promise.all([
          fetch("/api/companies?count=true", { credentials: "include" }),
          fetch("/api/users?role=supervisor&count=true", { credentials: "include" }),
          fetch("/api/users?count=true", { credentials: "include" }),
        ]);

        if (companyRes.ok) {
          const companyData = await companyRes.json();
          setCompanyCount(companyData.count || 0);
        }

        if (supervisorRes.ok) {
          const supervisorData = await supervisorRes.json();
          setSupervisorCount(supervisorData.count || 0);
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserCount(userData.count || 0);
        }
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // 🔒 Load the latest audit logs to show in the overview card
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error("Error fetching latest logs:", err);
      }
    };

    fetchLogs();
  }, []);

  const reports = [
    { action: "Client created", name: "RM John Smith" },
    { action: "RM created", name: "Client Amina Khan" },
    { action: "Client deleted", name: "RM David Ortiz" },
    { action: "RM removed", name: "Supervisor Maya Patel" },
    { action: "Client updated", name: "RM Olivia Brooks" },
    { action: "Supervisor updated", name: "Sofia Reed" },
  ];

  return (
    <div className="superadmin-dashboard-container">
      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-stat-cards">
        <div className="stat-card green-card">
          <div className="stat-card-header">
            <svg
              className="stat-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="7" y1="7" x2="17" y2="7"></line>
              <line x1="7" y1="12" x2="17" y2="12"></line>
              <line x1="7" y1="17" x2="17" y2="17"></line>
            </svg>
            <h2 className="stat-card-label">Companies</h2>
          </div>
          <div className="stat-card-value">{loading ? "..." : companyCount}</div>
        </div>

        <div className="stat-card gray-card">
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
            <h2 className="stat-card-label">Supervisors</h2>
          </div>
          <div className="stat-card-value">{loading ? "..." : supervisorCount}</div>
        </div>

        <div className="stat-card green-card">
          <div className="stat-card-header">
            <svg
              className="stat-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M17 11a4 4 0 1 0 0-8"></path>
              <path d="M3 21v-2a4 4 0 0 1 4-4h4"></path>
              <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
            </svg>
            <h2 className="stat-card-label">Users</h2>
          </div>
          <div className="stat-card-value">{loading ? "..." : userCount}</div>
        </div>

        <div className="stat-card gray-card">
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
      </div>

      <div className="admin-activity-cards">
        <div className="activity-card">
          <div className="activity-card-header">
            <svg
              className="activity-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <h3 className="activity-card-title">Reports</h3>
          </div>
          <ul className="activity-list reports-list">
            {reports.map((item, index) => (
              <li key={index} className="activity-list-item reports-list-item">
                <div className="report-row">
                  <span className="report-action">{item.action}</span>
                  <span className="report-name"> - {item.name}</span>
                </div>
                <button
                  type="button"
                  className="report-button"
                  onClick={() => router.push("/dashboard?menu=reports")}
                >
                  Check report
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="activity-card">
          <div className="activity-card-header">
            <svg
              className="activity-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 className="activity-card-title">Logs</h3>
          </div>
          <div className="log-table">
            <div className="log-row log-header">
              <span>Date</span>
              <span>Time</span>
              <span>Company</span>
              <span>Activity</span>
            </div>
            {logs.length === 0 ? (
              <div className="log-row">
                <span data-label="Activity">No activity logged yet</span>
              </div>
            ) : (
              logs.map((item, index) => (
                <div key={item._id || index} className="log-row">
                  <span data-label="Date">{formatDate(item.createdAt)}</span>
                  <span data-label="Time">{formatTime(item.createdAt)}</span>
                  <span data-label="Company">{item.companyName || "—"}</span>
                  <span data-label="Activity">{actionLabel(item)}</span>
                  <button
                    type="button"
                    className="log-button"
                    onClick={() => router.push("/dashboard?menu=logs")}
                  >
                    Check activity
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
