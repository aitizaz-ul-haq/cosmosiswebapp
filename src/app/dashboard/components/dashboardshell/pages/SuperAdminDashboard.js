"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardPageLoading } from "./loading/DashboardPageLoading";
import { ActionList, ActivityTable, Badge, DashboardHero, Icon, Panel, StackedBarChart, StatCard } from "./dashboard/DashboardUI";

const REPORTS = [
  { title: "Monthly Onboarding Summary", description: "Review onboarding across all companies", icon: "document", tone: "teal" },
  { title: "User Activity Report", description: "Explore activity across the platform", icon: "chart", tone: "violet" },
  { title: "Compliance Status Report", description: "Review client onboarding requirements", icon: "shield", tone: "teal" },
  { title: "Company Growth Report", description: "View your registered companies", icon: "trend", tone: "violet" },
  { title: "System Audit Report", description: "Review platform audit activity", icon: "clock", tone: "slate" },
];

function actionLabel(row) {
  if (row.action === "login_success") return "User Login";
  if (row.action === "login_failed") return "Login Failed";
  if (row.action === "logout") return "User Logout";
  return row.actionTitle || (row.action || "Activity").replace(/_/g, " ");
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function companyId(value) { return String(value?._id || value || ""); }

function pipelineValues(clients) {
  return clients.reduce((values, client) => {
    const status = client.onboarding?.status;
    if (status === "approved") values[0] += 1;
    else if (status === "submitted" || client.status === "under_review") values[2] += 1;
    else if (status === "in_progress") values[1] += 1;
    else values[3] += 1;
    return values;
  }, [0, 0, 0, 0]);
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [counts, setCounts] = useState({ companies: null, supervisors: null, users: null });
  const [companies, setCompanies] = useState([]);
  const [clients, setClients] = useState(null);
  const [logs, setLogs] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useDashboardPageLoading(loading);

  useEffect(() => {
    let active = true;
    const options = { credentials: "include", cache: "no-store" };
    async function request(url) {
      const response = await fetch(url, options);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to load dashboard data.");
      return data;
    }
    const requests = [
      { label: "Company totals", url: "/api/companies?count=true", apply: (data) => setCounts((previous) => ({ ...previous, companies: Number(data.count) || 0 })) },
      { label: "Supervisor totals", url: "/api/users?role=supervisor&count=true", apply: (data) => setCounts((previous) => ({ ...previous, supervisors: Number(data.count) || 0 })) },
      { label: "User totals", url: "/api/users?count=true", apply: (data) => setCounts((previous) => ({ ...previous, users: Number(data.count) || 0 })) },
      { label: "Companies", url: "/api/companies", apply: (data) => setCompanies(Array.isArray(data.companies) ? data.companies : []) },
      { label: "Onboardings", url: "/api/clients", apply: (data) => setClients(Array.isArray(data.clients) ? data.clients : []) },
      { label: "Platform activity", url: "/api/logs?limit=5", apply: (data) => setLogs(Array.isArray(data.logs) ? data.logs.slice(0, 5) : []) },
    ];
    Promise.allSettled(requests.map(async ({ label, url, apply }) => {
      try {
        const data = await request(url);
        if (active) apply(data);
      } catch (err) {
        if (active && err?.name !== "AbortError") setErrors((previous) => [...previous, label]);
      }
    })).then(() => { if (active) setLoading(false); });
    // Development remounts and navigation must not publish stale results.
    return () => { active = false; };
  }, []);

  const bars = useMemo(() => {
    const companyRows = companies.length > 0 ? companies : [...new Map((clients || []).map((client) => [companyId(client.companyId), { _id: client.companyId, name: client.companyName || "Unassigned Company" }])).values()];
    return companyRows.filter((company) => companyFilter === "all" || companyId(company._id) === companyFilter).map((company) => {
      const group = (clients || []).filter((client) => companyId(client.companyId) === companyId(company._id));
      return { label: company.name, sublabel: `(${group.length} total)`, values: pipelineValues(group) };
    });
  }, [companies, clients, companyFilter]);

  const goTo = (menu) => router.push(`/dashboard?menu=${menu}`);
  const showCount = (value) => value == null ? loading ? "…" : "—" : value;
  const ongoingCount = clients?.filter((client) => client.onboarding?.status === "in_progress").length;

  return (
    <div className="dsh-dashboard dsh-dashboard--admin">
      <DashboardHero title="Superadmin Dashboard" subtitle="Platform overview and management for the Cosmosis client onboarding system." tagline="Secure Onboarding. Stronger Investments." />
      {errors.length > 0 && <div className="dsh-error" role="alert">Unable to load: {errors.join(", ")}. Refresh to try again.</div>}
      <div className="dsh-stats">
        <StatCard label="Total Companies" value={showCount(counts.companies)} icon="building" description="Registered on the platform" />
        <StatCard label="Supervisors" value={showCount(counts.supervisors)} icon="users" description="Across all companies" />
        <StatCard label="Total Users" value={showCount(counts.users)} icon="users" tone="teal" description="Across all platform roles" />
        <StatCard label="In-Progress Onboardings" value={showCount(ongoingCount)} icon="document" tone="slate" description="Currently completing onboarding" />
      </div>

      <div className="dsh-admin-top dsh-row-top">
        <Panel title="Onboarding Pipeline by Company" icon="chart" action={<select className="dsh-select" data-log-title="Superadmin dashboard: filter company pipeline" aria-label="Filter onboarding pipeline by company" value={companyFilter} onChange={(event) => setCompanyFilter(event.target.value)}>
          <option value="all">All Companies</option>{companies.map((company) => <option key={company._id} value={companyId(company._id)}>{company.name}</option>)}
        </select>}><StackedBarChart bars={bars} /></Panel>
        <Panel title="Recent Reports" icon="document" action={<button type="button" data-log-title="Superadmin dashboard: view all reports" className="dsh-text-button" onClick={() => goTo("reports")}>View all</button>}>
          <div className="dsh-report-list">{REPORTS.map((report) => (
            <div className="dsh-report-item" key={report.title}>
              <span className={`dsh-report-icon dsh-tone--${report.tone}`}><Icon name={report.icon} size={23} /></span>
              <div className="dsh-report-copy"><strong>{report.title}</strong><span>{report.description}</span></div>
              <button className="dsh-report-button" data-log-title={`Superadmin dashboard: view ${report.title}`} type="button" onClick={() => goTo("reports")}>View report</button>
            </div>
          ))}</div>
        </Panel>
        <Panel title="Quick Actions" icon="lightning"><ActionList items={[
          { title: "Add New Company", description: "Register a new company to the platform", icon: "building", tone: "teal", onClick: () => goTo("companies") },
          { title: "Invite Supervisor", description: "Create a new supervisor account", icon: "userPlus", tone: "violet", onClick: () => goTo("supervisors") },
          { title: "View Platform Logs", description: "Check system activity and audit logs", icon: "document", tone: "slate", onClick: () => goTo("logs") },
          { title: "Generate Report", description: "View platform reporting", icon: "chart", tone: "violet", onClick: () => goTo("reports") },
        ]} /></Panel>
      </div>

      <div className="dsh-admin-bottom dsh-row-bottom">
        <Panel title="Recent Platform Activity" icon="clock" action={<button type="button" data-log-title="Superadmin dashboard: view all platform logs" className="dsh-text-button" onClick={() => goTo("logs")}>View all logs</button>}>
          <ActivityTable columns={[
            { key: "createdAt", label: "Date & Time", render: formatDate },
            { key: "action", label: "Activity", render: (_value, row) => actionLabel(row) },
            { key: "entity", label: "Entity", render: (_value, row) => row.metadata?.entity || row.role || "Platform" },
            { key: "details", label: "Details", render: (_value, row) => row.actionTitle || actionLabel(row) },
            { key: "username", label: "User", render: (value, row) => value || row.name || "—" },
            { key: "status", label: "Status", render: (_value, row) => <Badge tone={row.action === "login_failed" ? "red" : "teal"}>{row.action === "login_failed" ? "Failed" : "Recorded"}</Badge> },
          ]} rows={logs} emptyMessage={loading ? "Loading platform activity…" : errors.includes("Platform activity") ? "Platform activity is unavailable." : "No platform activity has been recorded yet."} />
        </Panel>
        <Panel title="System Health & Compliance" icon="shield" action={<Badge tone="slate">Monitoring unavailable</Badge>}>
          <div className="dsh-health-grid">{[
            { label: "System Uptime", icon: "server", tone: "teal", description: "Unavailable" },
            { label: "Compliance Status", icon: "shield", tone: "teal", description: "Unavailable" },
            { label: "Storage Usage", icon: "database", tone: "violet", description: "Unavailable" },
            { label: "Active Sessions", icon: "users", tone: "violet", description: "Unavailable" },
          ].map((metric) => (
            <div className="dsh-health-item" key={metric.label}>
              <span className={`dsh-health-icon dsh-tone--${metric.tone}`}><Icon name={metric.icon} size={26} /></span>
              <div className="dsh-health-copy"><span>{metric.label}</span><strong className="dsh-health-value">—</strong><small>{metric.description}</small></div>
            </div>
          ))}</div>
        </Panel>
      </div>
    </div>
  );
}
