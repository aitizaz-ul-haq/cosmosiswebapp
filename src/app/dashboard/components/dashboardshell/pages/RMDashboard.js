"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useDashboardPageLoading } from "./loading/DashboardPageLoading";
import { DashboardHero, StatCard, Panel, Icon, Badge, StackedBarChart, EmptyState, ActivityTable } from "./dashboard/DashboardUI";
import { clientId, clientName, clientCompleted, clientInProgress, clientEvents, filterClients, formatDate, monthlyTrend, phaseBars, relativeTime, scheduleParts, submissionRows, validDate } from "./dashboard/data";

export default function RMDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progressFilter, setProgressFilter] = useState("all");

  useDashboardPageLoading(loading);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/clients", { credentials: "include", cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Failed to load dashboard data");
        if (active) setClients(data.clients || []);
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
  const events = useMemo(() => clientEvents(clients), [clients]);
  const submissions = useMemo(() => submissionRows(clients), [clients]);
  const upcoming = useMemo(() => clients.filter((client) => client.status === "scheduled" && validDate(client.scheduledRegistrationAt)?.getTime() >= Date.now()).sort((a, b) => new Date(a.scheduledRegistrationAt) - new Date(b.scheduledRegistrationAt)), [clients]);
  const completed = clients.filter(clientCompleted);
  const inProgress = clients.filter(clientInProgress);
  const totalClientTrend = monthlyTrend(clients.map((client) => client.createdAt));
  const completedTrend = monthlyTrend(completed.map((client) => client.onboarding?.approvedAt));
  const progressClients = filterClients(clients, progressFilter);
  const value = (count) => loading ? "…" : error ? "—" : count;
  const viewAll = (menu, label = "View all") => <button type="button" className="dsh-text-action" data-log-title={`Dashboard: ${label} ${menu}`} onClick={() => navigate(menu)}>{label}</button>;

  return (
    <div className="dashboard-page dsh-page--rm" aria-busy={loading}>
      <DashboardHero title="Relationship Manager Dashboard" subtitle="Manage your client relationships, track onboarding progress, and stay on top of key activities." tagline={<>Stronger Relationships.<br />Smoother Onboarding.</>} />
      {error && <div className="dsh-error" role="alert">{error}</div>}
      <div className="dsh-stats">
        <StatCard label="Total Clients" value={value(clients.length)} icon="users" tone="violet" trend={totalClientTrend} description={totalClientTrend == null ? "Assigned to you" : "vs last month"} />
        <StatCard label="In Progress Onboardings" value={value(inProgress.length)} icon="file" tone="violet" description="Currently onboarding" />
        <StatCard label="Completed Onboardings" value={value(completed.length)} icon="checkCircle" tone="green" trend={completedTrend} description={completedTrend == null ? "Approved applications" : "vs last month"} />
        <StatCard label="Scheduled Meetings" value={value(upcoming.length)} icon="calendar" tone="violet" description="Upcoming onboardings" />
      </div>

      <div className="dsh-row-top dsh-grid dsh-grid--rm">
        <Panel title="Client Onboarding Progress" icon="chart" action={<select className="dsh-select" aria-label="Filter client onboarding progress" value={progressFilter} onChange={(event) => setProgressFilter(event.target.value)}><option value="all">My Clients</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="under_review">Under Review</option></select>}>
          <StackedBarChart bars={phaseBars(progressClients)} max={Math.max(10, progressClients.length)} />
        </Panel>

        <Panel title="Upcoming Scheduled Clients" icon="calendar" action={viewAll("scheduled")}>
          {upcoming.length ? <ul className="dsh-list dsh-schedule-list">{upcoming.slice(0, 4).map((client) => {
            const schedule = scheduleParts(client);
            return <li className="dsh-list-row" key={clientId(client)}><div className="dsh-date-tile"><small>{schedule.month}</small><strong>{schedule.day}</strong></div><div className="dsh-list-copy"><strong>{clientName(client)}</strong><span>Scheduled onboarding</span><span>{schedule.time}{client.scheduledCity ? ` · ${client.scheduledCity}` : ""}</span></div><button type="button" className="dsh-inline-action" data-log-title={`Dashboard: View scheduled onboarding for ${clientName(client)}`} onClick={() => navigate("scheduled")} aria-label={`View scheduled onboarding for ${clientName(client)}`}>View details</button></li>;
          })}</ul> : <EmptyState>{loading ? "Loading scheduled clients…" : "No upcoming scheduled clients."}</EmptyState>}
        </Panel>

        <Panel title="Recent Notifications" icon="bell" action={viewAll("notifications")}>
          {events.length ? <ul className="dsh-list dsh-notification-list">{events.slice(0, 4).map((event) => <li className="dsh-list-row" key={event.id}><span className={`dsh-list-icon dsh-tone--${event.tone}`}><Icon name={event.icon} size={21} /></span><div className="dsh-list-copy"><strong>{event.title}</strong><span>{event.description}</span><span>{relativeTime(event.date)}</span></div><button type="button" className="dsh-chevron" data-log-title={`Dashboard: ${event.title} for ${event.name}`} onClick={() => navigate(event.menu)} aria-label={`View ${event.title.toLowerCase()}`}><Icon name="chevronRight" size={18} /></button></li>)}</ul> : <EmptyState>{loading ? "Loading notifications…" : "No recent notifications."}</EmptyState>}
        </Panel>
      </div>

      <div className="dsh-row-bottom dsh-grid dsh-grid--rm-bottom">
        <Panel title="Recent Client Activity" icon="clock" action={viewAll("clients", "View all activity")}>
          <ActivityTable columns={[{ key: "date", label: "Date & Time", render: (date) => formatDate(date, true) }, { key: "name", label: "Client" }, { key: "activity", label: "Activity" }, { key: "details", label: "Details" }, { key: "status", label: "Status", render: (status, row) => <Badge tone={row.tone}>{status}</Badge> }]} rows={events.slice(0, 5)} emptyMessage={loading ? "Loading client activity…" : "No recent client activity."} />
        </Panel>
        <Panel title="Latest Submissions" icon="file" action={viewAll("submissions")}>
          {submissions.length ? <ul className="dsh-list dsh-submission-list">{submissions.slice(0, 4).map((submission) => <li className="dsh-list-row" key={submission.id}><span className={`dsh-list-icon dsh-tone--${submission.tone}`}><Icon name="file" size={18} /></span><div className="dsh-list-copy"><strong>{submission.name}</strong><span>{submission.title}</span></div><span className="dsh-list-meta">{formatDate(submission.date)}</span><Badge tone={submission.tone}>{submission.status}</Badge><button type="button" className="dsh-chevron" data-log-title={`Dashboard: View submission from ${submission.name}`} onClick={() => navigate("submissions")} aria-label={`View submission from ${submission.name}`}><Icon name="chevronRight" size={18} /></button></li>)}</ul> : <EmptyState>{loading ? "Loading submissions…" : "No applications have been submitted yet."}</EmptyState>}
        </Panel>
      </div>
    </div>
  );
}
