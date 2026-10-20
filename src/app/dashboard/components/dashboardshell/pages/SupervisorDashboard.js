"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { DashboardHero, StatCard, Panel, Icon, Badge, StackedBarChart, ActionList, EmptyState, ActivityTable, Avatar } from "./dashboard/DashboardUI";
import { clientBars, clientCompleted, clientId, clientInProgress, clientName, filterClients, formatDate, managerClients, monthlyTrend, relativeTime, submissionRows, withinPeriod } from "./dashboard/data";

export default function SupervisorDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [managers, setManagers] = useState([]);
  const [rmCount, setRmCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState({ clients: false, managers: false });
  const [progressFilter, setProgressFilter] = useState("all");
  const [performancePeriod, setPerformancePeriod] = useState("this_month");

  useEffect(() => {
    if (!user?.companyId) {
      setLoading(false);
      setError("A company is required to load your dashboard.");
      return;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      const options = { credentials: "include", cache: "no-store" };
      const company = encodeURIComponent(typeof user.companyId === "object" ? user.companyId._id : user.companyId);
      try {
        const requests = await Promise.allSettled([
          fetch("/api/clients", options).then(async (response) => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || "Failed to load clients");
            return data.clients || [];
          }),
          fetch(`/api/users?role=rm&companyId=${company}`, options).then(async (response) => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || "Failed to load relationship managers");
            return data.users || [];
          }),
          fetch(`/api/users?role=rm&companyId=${company}&count=true`, options).then(async (response) => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || "Failed to load relationship manager count");
            return data.count || 0;
          }),
        ]);
        if (!active) return;
        const [clientResult, managerResult, countResult] = requests;
        setAvailable({ clients: clientResult.status === "fulfilled", managers: countResult.status === "fulfilled" || managerResult.status === "fulfilled" });
        if (clientResult.status === "fulfilled") setClients(clientResult.value);
        if (managerResult.status === "fulfilled") setManagers(managerResult.value);
        if (countResult.status === "fulfilled") setRmCount(countResult.value);
        else if (managerResult.status === "fulfilled") setRmCount(managerResult.value.length);
        const failure = requests.find((request) => request.status === "rejected");
        if (failure) setError(failure.reason?.message || "Some dashboard data could not be loaded");
      } catch (err) {
        if (active && err?.name !== "AbortError") setError(err?.message || "Failed to load dashboard data");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [user]);

  const navigate = (menu) => router.push(`/dashboard?menu=${menu}`);
  const viewAll = (menu, label = "View all") => <button type="button" className="dsh-text-action" data-log-title={`Dashboard: ${label} ${menu}`} onClick={() => navigate(menu)}>{label}</button>;
  const completed = clients.filter(clientCompleted);
  const inProgress = clients.filter(clientInProgress);
  const activeClients = clients.filter((client) => !["cancelled", "on_hold"].includes(client.status));
  const activeClientTrend = monthlyTrend(activeClients.map((client) => client.createdAt));
  const completedTrend = monthlyTrend(completed.map((client) => client.onboarding?.approvedAt));
  const pending = useMemo(() => clients.filter((client) => client.status === "approval_pending").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [clients]);
  const submissions = useMemo(() => submissionRows(clients), [clients]);
  const progressClients = filterClients(clients, progressFilter);
  const value = (count, isAvailable = available.clients) => loading ? "…" : isAvailable ? count : "—";
  const performanceRows = useMemo(() => managers.map((manager) => {
    const assigned = managerClients(clients, manager);
    return {
      id: String(manager._id || manager.id),
      name: manager.fullName || manager.username || "Relationship Manager",
      total: assigned.length,
      clients: assigned.filter((client) => withinPeriod(client.createdAt, performancePeriod)).length,
      completed: assigned.filter((client) => clientCompleted(client) && withinPeriod(client.onboarding?.approvedAt, performancePeriod)).length,
      inProgress: assigned.filter((client) => clientInProgress(client) && withinPeriod(client.createdAt, performancePeriod)).length,
    };
  }), [clients, managers, performancePeriod]);

  return (
    <div className="dashboard-page dsh-page--supervisor" aria-busy={loading}>
      <DashboardHero title="Supervisor Dashboard" subtitle="Monitor your team, review client onboarding progress, and manage approvals." tagline={<>Efficient Oversight.<br />Successful Onboardings.</>} />
      {error && <div className="dsh-error" role="alert">{error}</div>}
      <div className="dsh-stats">
        <StatCard label="Relationship Managers" value={value(rmCount, available.managers)} icon="users" tone="violet" description="Across your team" />
        <StatCard label="Active Clients" value={value(activeClients.length)} icon="users" tone="green" trend={activeClientTrend} description={activeClientTrend == null ? "Across your company" : "vs last month"} />
        <StatCard label="Completed Onboardings" value={value(completed.length)} icon="check" tone="green" trend={completedTrend} description={completedTrend == null ? "Approved applications" : "vs last month"} />
        <StatCard label="In-Progress Onboardings" value={value(inProgress.length)} icon="file" tone="slate" description="Currently onboarding" />
      </div>

      <div className="dsh-row-top dsh-grid dsh-grid--supervisor">
        <Panel title="Onboarding Progress by Client" icon="chart" action={<select className="dsh-select" aria-label="Filter onboarding progress by client" value={progressFilter} onChange={(event) => setProgressFilter(event.target.value)}><option value="all">All Clients</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="under_review">Under Review</option></select>}>
          {progressClients.length ? <StackedBarChart bars={clientBars(progressClients)} max={6} /> : <EmptyState>{loading ? "Loading onboarding progress…" : "No clients match this filter."}</EmptyState>}
        </Panel>
        <Panel title="Pending Approvals" icon="clock" action={viewAll("approvals")}>
          {pending.length ? <ul className="dsh-list dsh-approval-list">{pending.slice(0, 5).map((client) => <li className="dsh-list-row dsh-approval-row" key={clientId(client)}><span className="dsh-list-icon dsh-tone--slate"><Icon name="file" size={19} /></span><div className="dsh-list-copy"><strong>{clientName(client)}</strong><span>{client.companyName || "Client onboarding"}</span></div><div className="dsh-list-meta"><span>{relativeTime(client.createdAt)}</span><span>Client Approval</span></div><button type="button" className="dsh-inline-action" data-log-title={`Dashboard: Review client ${clientName(client)}`} onClick={() => navigate("approvals")} aria-label={`Review ${clientName(client)}`}>Review</button></li>)}</ul> : <EmptyState>{loading ? "Loading pending approvals…" : "No approvals are waiting for review."}</EmptyState>}
        </Panel>
        <Panel title="Quick Actions" icon="lightning">
          <ActionList items={[{ title: "Review Pending Approvals", description: "Manage client submissions awaiting approval", icon: "checkCircle", tone: "green", onClick: () => navigate("approvals") }, { title: "View Under Review Cases", description: "Check cases currently under review", icon: "search", tone: "violet", onClick: () => navigate("underreview") }, { title: "Generate Report", description: "Create onboarding or team reports", icon: "chart", tone: "violet", onClick: () => navigate("reports") }, { title: "View Onboarding Status", description: "Track overall onboarding progress", icon: "pie", tone: "violet", onClick: () => navigate("onboardingstatus") }]} />
        </Panel>
      </div>

      <div className="dsh-row-bottom dsh-grid dsh-grid--supervisor-bottom">
        <Panel title="Recent Submissions" icon="file" action={viewAll("submissions", "View all submissions")}>
          <ActivityTable columns={[{ key: "date", label: "Date & Time", render: (date) => formatDate(date, true) }, { key: "name", label: "Client Name" }, { key: "company", label: "Company" }, { key: "manager", label: "Assigned RM" }, { key: "stage", label: "Stage" }, { key: "status", label: "Status", render: (status, row) => <Badge tone={row.tone}>{status}</Badge> }]} rows={submissions.slice(0, 5)} emptyMessage={loading ? "Loading submissions…" : "No applications have been submitted yet."} />
        </Panel>
        <Panel title="Relationship Manager Performance" icon="users" action={<select className="dsh-select" aria-label="Relationship manager performance period" value={performancePeriod} onChange={(event) => setPerformancePeriod(event.target.value)}><option value="this_month">This Month</option><option value="last_month">Last Month</option><option value="all">All Time</option></select>}>
          <div className="dsh-performance-table"><ActivityTable columns={[{ key: "name", label: "Relationship Manager", render: (name, row, index) => <div className="dsh-manager-cell"><Avatar name={name} tone={index % 2 ? "violet" : "green"} /><div><strong>{name}</strong><span>{row.total} client{row.total === 1 ? "" : "s"}</span></div></div> }, { key: "clients", label: "Clients", render: (count) => <strong className="dsh-performance-number">{count}</strong> }, { key: "completed", label: "Completed", render: (count) => <strong className="dsh-performance-number">{count}</strong> }, { key: "inProgress", label: "In Progress", render: (count) => <strong className="dsh-performance-number">{count}</strong> }]} rows={performanceRows} emptyMessage={loading ? "Loading relationship managers…" : "No relationship managers have been added yet."} /></div>
        </Panel>
      </div>
    </div>
  );
}
