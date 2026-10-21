"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import GenericTable from "./GenericTable";

// Human readable label for a log row's action column
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
  // UI button clicks
  if (a === "button_click") {
    return row?.actionTitle ? `Clicked: ${row.actionTitle}` : "Clicked a control";
  }
  // Functional actions (create / edit / delete) store a full description in actionTitle
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

// Combines a date input (YYYY-MM-DD) and an optional time input (HH:MM) into an ISO string
function combineDateTime(date, time, endOfDay = false) {
  if (!date) return "";
  const t = time && time.trim() !== "" ? time : endOfDay ? "23:59:59" : "00:00:00";
  const parsed = new Date(`${date}T${t}`);
  return isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🕒 Timeline filter state
  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("");
  const [company, setCompany] = useState("");
  const [username, setUsername] = useState("");
  const [actionType, setActionType] = useState("all");

  const fetchLogs = useCallback(
    async (overrides = null) => {
      setLoading(true);
      setError("");

      const f = overrides || {
        fromDate,
        fromTime,
        toDate,
        toTime,
        company,
        username,
        actionType,
      };

      const params = new URLSearchParams();
      const start = combineDateTime(f.fromDate, f.fromTime, false);
      const end = combineDateTime(f.toDate, f.toTime, true);

      if (start) params.set("startDate", start);
      if (end) params.set("endDate", end);
      if (f.company.trim()) params.set("company", f.company.trim());
      if (f.username.trim()) params.set("username", f.username.trim());
      if (f.actionType !== "all") params.set("action", f.actionType);

      try {
        const res = await fetch(`/api/logs?${params.toString()}`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error || "Failed to load logs");
          setLogs([]);
        } else {
          setLogs(Array.isArray(data.logs) ? data.logs : []);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setError("Failed to load logs");
        setLogs([]);
      } finally {
        setLoading(false);
      }
    },
    [fromDate, fromTime, toDate, toTime, company, username, actionType]
  );

  // Initial load
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilters = () => {
    const cleared = {
      fromDate: "",
      fromTime: "",
      toDate: "",
      toTime: "",
      company: "",
      username: "",
      actionType: "all",
    };
    setFromDate("");
    setFromTime("");
    setToDate("");
    setToTime("");
    setCompany("");
    setUsername("");
    setActionType("all");
    // Reload the full, unfiltered list
    fetchLogs(cleared);
  };

  const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => row.name || row.username || "—",
        cell: ({ row }) => row.original.name || row.original.username || "—",
      },
      {
        id: "company",
        header: "Company",
        accessorFn: (row) => row.companyName || "—",
        cell: ({ row }) => row.original.companyName || "—",
      },
      {
        id: "time",
        header: "Time",
        accessorFn: (row) => row.createdAt,
        cell: ({ row }) => formatTime(row.original.createdAt),
      },
      {
        id: "date",
        header: "Date",
        accessorFn: (row) => row.createdAt,
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: "action",
        header: "Action",
        accessorFn: (row) => actionLabel(row),
        cell: ({ row }) => actionLabel(row.original),
      },
    ],
    []
  );

  return (
    <div>
      {/* 🔎 Timeline-based filter panel — rendered under the table description */}
      <GenericTable
        title="System Logs"
        description="Every login, logout and interaction across the platform. Filter by date, time, company or user to audit a session."
        data={logs}
        columns={columns}
        filterableFields={["name", "username", "companyName", "action"]}
        actions={[]}
        loading={loading}
        disableRowModal
        hideDefaultFilter
        filtersSlot={
          <div className="table-custom-filters">
            <div className="table-filter-grid">
              <label className="table-filter-field">
                From date
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </label>
              <label className="table-filter-field">
                From time
                <input
                  type="time"
                  step="1"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                />
              </label>
              <label className="table-filter-field">
                To date
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </label>
              <label className="table-filter-field">
                To time
                <input
                  type="time"
                  step="1"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                />
              </label>
              <label className="table-filter-field">
                Company
                <input
                  type="text"
                  placeholder="Company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>
              <label className="table-filter-field">
                User
                <input
                  type="text"
                  placeholder="Name or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label className="table-filter-field">
                Action
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                >
                  <option value="all">All actions</option>
                  <option value="login_success">Logged in</option>
                  <option value="login_failed">Failed login</option>
                  <option value="logout">Logged out</option>
                  <option value="button_click">Button clicks</option>
                  <option value="record_created">Created records</option>
                  <option value="record_updated">Edited records</option>
                  <option value="record_deleted">Deleted records</option>
                </select>
              </label>
            </div>

            <div className="table-filter-actions">
              <button
                type="button"
                onClick={() => fetchLogs()}
                disabled={loading}
                className="table-filter-button"
                data-log-title="Logs: Get latest logs"
              >
                {loading ? "Refreshing…" : "Get latest logs"}
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="table-filter-button"
                data-log-title="Logs: Clear filters"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => fetchLogs()}
                className="table-filter-button is-primary"
                data-log-title="Logs: Apply filters"
              >
                Apply filters
              </button>
            </div>

            {error && (
              <p className="table-filter-error" role="alert">{error}</p>
            )}
          </div>
        }
      />
    </div>
  );
}

