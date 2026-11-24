"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { getDashboardPageSize } from "@/lib/dashboardPagination";
import { useDashboardPageLoading } from "./loading/DashboardPageLoading";
import GenericTable from "./GenericTable";
import ManagementTablePagination from "./pagecomponents/ManagementTablePagination";
import { DashboardHero, EmptyState, Icon, Panel } from "./dashboard/DashboardUI";
import { clientEvents, formatDate, relativeTime } from "./dashboard/data";
import "./styles/generictable.css";

const notificationColumns = [
  { accessorKey: "title", header: "Notification" },
  { accessorKey: "message", header: "Message" },
  { accessorKey: "companyName", header: "Company" },
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "createdDate", header: "Date" },
  { accessorKey: "status", header: "Status" },
];

function PlatformNotifications() {
  return (
    <GenericTable
      title="Notifications"
      description="View platform notifications and updates. Search and filter by notification, message, company, recipient, date, or status."
      data={[]}
      columns={notificationColumns}
      filterableFields={notificationColumns.map((column) => column.accessorKey)}
      disableRowModal
    />
  );
}

function ClientActivityNotifications({ user }) {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = getDashboardPageSize(user.role);
  const paginate = user.role === "supervisor";

  useDashboardPageLoading(loading);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      setClients([]);
      try {
        const response = await fetch("/api/clients", { credentials: "include", cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Failed to load client activity");
        if (active) setClients(data.clients || []);
      } catch (err) {
        if (active) {
          setClients([]);
          if (err?.name !== "AbortError") setError(err?.message || "Failed to load client activity");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [user]);

  const events = useMemo(() => error ? [] : clientEvents(clients), [clients, error]);
  const pageCount = Math.max(1, Math.ceil(events.length / pageSize));
  const currentIndex = Math.min(pageIndex, pageCount - 1);
  const visibleEvents = paginate ? events.slice(currentIndex * pageSize, (currentIndex + 1) * pageSize) : events;

  useEffect(() => {
    setPageIndex(0);
  }, [events, user.id, user._id, user.companyId, user.role]);

  useEffect(() => {
    setPageIndex((previous) => Math.min(previous, pageCount - 1));
  }, [pageCount]);

  return (
    <div className="dashboard-page" aria-busy={loading}>
      <DashboardHero title="Notifications" subtitle={user.role === "supervisor" ? "Recent client activity across your company." : "Recent activity from your clients."} />
      {error && <div className="dsh-error" role="alert">{error}</div>}
      <Panel title="Client Activity" icon="bell">
        {!loading && visibleEvents.length > 0 && !error ? <ul className="dsh-list dsh-notification-list">{visibleEvents.map((event) => (
          <li className="dsh-list-row" key={event.id}>
            <span className={`dsh-list-icon dsh-tone--${event.tone}`}><Icon name={event.icon} size={21} /></span>
            <div className="dsh-list-copy"><strong>{event.title}</strong><span>{event.description}</span><span title={formatDate(event.date, true)}>{relativeTime(event.date)}</span></div>
            <button type="button" className="dsh-chevron" data-log-title={`Notifications: ${event.title} for ${event.name}`} aria-label={`View ${event.title.toLowerCase()} for ${event.name}`} onClick={() => router.push(`/dashboard?menu=${event.menu}`)}><Icon name="chevronRight" size={18} /></button>
          </li>
        ))}</ul> : <EmptyState>{loading ? "Loading client activity…" : error ? "Client activity is unavailable." : "No recent client activity."}</EmptyState>}
        {paginate && !loading && <ManagementTablePagination pagination={{ pageIndex: currentIndex, pageSize }} total={events.length} onPageChange={setPageIndex} />}
      </Panel>
    </div>
  );
}

export default function NotificationsPage() {
  const { user } = useUser();
  if (!user) return null;
  return user.role === "superadmin" ? <PlatformNotifications /> : <ClientActivityNotifications user={user} />;
}
