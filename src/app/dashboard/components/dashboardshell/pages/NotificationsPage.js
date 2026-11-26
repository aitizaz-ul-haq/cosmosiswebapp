"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { getDashboardPageSize } from "@/lib/dashboardPagination";
import { notificationEventKey } from "@/lib/notificationReads";
import { useDashboardPageLoading } from "./loading/DashboardPageLoading";
import GenericTable from "./GenericTable";
import NotificationDetailsModal from "./NotificationDetailsModal";
import { ModalButton, StatusPill } from "./modalkit/ModalKit";
import ManagementTablePagination from "./pagecomponents/ManagementTablePagination";
import { DashboardHero, EmptyState, Icon, Panel } from "./dashboard/DashboardUI";
import { clientEvents, formatDate, relativeTime } from "./dashboard/data";
import "./styles/generictable.css";
import "./styles/notifications.css";

function ComplianceNotifications({ user }) {
  const [clients, setClients] = useState([]);
  const [readKeys, setReadKeys] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadVersion, setLoadVersion] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [readUpdates, setReadUpdates] = useState({});
  const mounted = useRef(false);
  const requests = useRef(new Map());

  useEffect(() => {
    mounted.current = true;
    const pending = requests.current;
    return () => {
      mounted.current = false;
      pending.forEach((controller) => controller.abort());
      pending.clear();
    };
  }, []);

  useEffect(() => {
    let active = true;
    requests.current.forEach((request) => request.abort());
    requests.current.clear();
    setLoading(true);
    setLoadError("");
    setClients([]);
    setReadKeys(new Set());
    setReadUpdates({});
    setSelected(null);
    const load = async () => {
      try {
        const get = async (url) => {
          const response = await fetch(url, { credentials: "include", cache: "no-store" });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || "Unable to load notifications. Please try again.");
          return data;
        };
        const [clientData, receiptData] = await Promise.all([get("/api/clients"), get("/api/notification-reads")]);
        if (!Array.isArray(clientData.clients) || !Array.isArray(receiptData.reads)) throw new Error("Unable to load notifications. Please try again.");
        if (active) {
          setClients(clientData.clients);
          setReadKeys(new Set(receiptData.reads.map((read) => read?.key).filter((key) => typeof key === "string")));
        }
      } catch (error) {
        if (active && error?.name !== "AbortError") setLoadError(error?.message || "Unable to load notifications. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      // Let in-flight loads finish; inactive effects ignore their results.
      active = false;
    };
  }, [loadVersion]);

  const notifications = useMemo(() => clientEvents(clients).flatMap((event) => {
    const key = notificationEventKey(event.profileId, event.eventType, event.date);
    if (!key) return [];
    return [{ ...event, key, date: new Date(event.date).toISOString(), dateLabel: formatDate(event.date, true), status: readKeys.has(key) ? "Read" : "Unread" }];
  }), [clients, readKeys]);

  const filtered = useMemo(() => {
    const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return notifications.filter((notification) => {
      if (statusFilter !== "all" && notification.status.toLowerCase() !== statusFilter) return false;
      const text = [notification.title, notification.description, notification.dateLabel, notification.date, notification.status, notification.userName, notification.username, notification.userEmail].join(" ").toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [notifications, statusFilter, search]);

  const markRead = useCallback(async (notification) => {
    if (readKeys.has(notification.key) || requests.current.has(notification.key)) return;
    const controller = new AbortController();
    requests.current.set(notification.key, controller);
    setReadUpdates((previous) => ({ ...previous, [notification.key]: { pending: true, error: "", code: "" } }));
    try {
      const response = await fetch("/api/notification-reads", {
        method: "PATCH",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ profileId: notification.profileId, eventType: notification.eventType, eventDate: notification.date }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.read?.key !== notification.key) {
        const error = new Error(data.error || "Unable to mark this notification as read. Please try again.");
        error.code = data.code;
        throw error;
      }
      if (mounted.current && !controller.signal.aborted) {
        setReadKeys((previous) => new Set(previous).add(notification.key));
        setReadUpdates((previous) => ({ ...previous, [notification.key]: { pending: false, error: "", code: "" } }));
      }
    } catch (error) {
      if (mounted.current && !controller.signal.aborted) setReadUpdates((previous) => ({ ...previous, [notification.key]: { pending: false, error: error.message, code: error.code || "" } }));
    } finally {
      if (requests.current.get(notification.key) === controller) requests.current.delete(notification.key);
    }
  }, [readKeys]);

  const openNotification = useCallback((notification) => {
    setSelected(notification);
    markRead(notification);
  }, [markRead]);
  const closeNotification = useCallback(() => setSelected(null), []);
  const selectedUpdate = selected ? readUpdates[selected.key] : null;
  const selectedNotification = selected ? { ...selected, status: readKeys.has(selected.key) ? "Read" : "Unread", recipientName: user.fullName || user.username || "Compliance Officer" } : null;
  const retryRead = () => {
    if (selectedUpdate?.code === "EVENT_CHANGED") {
      setSelected(null);
      setLoadVersion((version) => version + 1);
    } else if (selected) markRead(selected);
  };

  const columns = useMemo(() => [
    { accessorKey: "title", header: "Title", cell: ({ row }) => <span className={`notifications-title${row.original.status === "Unread" ? " is-unread" : ""}`} title={row.original.title}>{row.original.title}</span> },
    { accessorKey: "description", header: "Description", cell: ({ getValue }) => <span className="notifications-description" title={getValue()}>{getValue()}</span> },
    { accessorKey: "dateLabel", header: "Date", cell: ({ row }) => <time className="notifications-date" dateTime={row.original.date}>{row.original.dateLabel}</time> },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <span className="notifications-status"><StatusPill tone={getValue() === "Read" ? "green" : "blue"}>{getValue()}</StatusPill></span> },
    { id: "actions", header: "Open", cell: ({ row }) => <button type="button" className="management-row-action is-info" data-notification-key={row.original.key} data-log-title={`Open notification: ${row.original.title} for ${row.original.userName}`} aria-label={`Open ${row.original.title.toLowerCase()} for ${row.original.userName}`} onClick={() => openNotification(row.original)}>Open</button> },
  ], [openNotification]);

  return <>
    <GenericTable
      title="Notifications"
      description="Review client activity across your company. Open a notification to see its details and mark it as read."
      className="notifications-table-page"
      data={filtered}
      columns={columns}
      loading={loading}
      disableRowModal
      hideDefaultFilter
      resetPaginationKey={`${statusFilter}:${search}`}
      filtersSlot={<>
        <div className="notifications-filters">
          <label className="notifications-filter notifications-status-filter"><span>Status</span><select aria-label="Filter notifications by read status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} data-log-title="Filter notification read status"><option value="all">All notifications</option><option value="unread">Unread</option><option value="read">Read</option></select></label>
          <label className="notifications-filter notifications-search-filter"><span>Search</span><input type="search" aria-label="Search notifications" placeholder="Search title, description, date or user…" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        </div>
        {loadError && <div className="notifications-load-error"><p role="alert">{loadError}</p><ModalButton icon="clock" onClick={() => setLoadVersion((version) => version + 1)} data-log-title="Retry loading notifications">Retry</ModalButton></div>}
      </>}
    />
    {selectedNotification && <NotificationDetailsModal notification={selectedNotification} onClose={closeNotification} readError={selectedUpdate?.error || ""} markingRead={Boolean(selectedUpdate?.pending)} onRetryRead={retryRead} />}
  </>;
}

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
  if (user.role === "superadmin") return <PlatformNotifications />;
  if (user.role === "supervisor") return <ComplianceNotifications key={`${user.role}:${user.companyId}:${user.id || user._id}`} user={user} />;
  return <ClientActivityNotifications user={user} />;
}
