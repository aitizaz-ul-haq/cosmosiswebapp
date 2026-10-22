"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import TablePageLayout from "./pagecomponents/TablePageLayout";
import ManagementTablePagination from "./pagecomponents/ManagementTablePagination";
import Icon from "./modalkit/Icon";
import {
  PHASE_CONFIG,
  PHASE_SECTIONS,
  STATUS_COLORS,
  getPhaseConfig,
  onboardingTypeLabel,
} from "./clientStatusShared";
import "./styles/generictable.css";
import "./styles/onboardingstatus.css";

const PAGE_SIZE = 8;
const CLOSE_MS = 800;
// Phase 0 is read-only documents, so it has no entry in PHASE_CONFIG.
const TIMELINE_PHASES = [{ phase: 0, name: "Prerequisites" }, ...PHASE_CONFIG];
// Clients actively going through onboarding.
// Approval pending / Register are set by the approval flow, so they are not selectable.
const ENGAGED_STATUSES = new Set(["ongoing", "on_hold", "cancelled"]);
const STATUS_OPTIONS = [
  { value: "ongoing", label: "In progress", dot: "#34d399" },
  { value: "on_hold", label: "On hold", dot: "#fbbf24" },
  { value: "cancelled", label: "Cancelled", dot: "#f87171" },
];
const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]));
const FILTERABLE_FIELDS = ["fullName", "created", "rmRemarks", "status", "phase"];
const FILTER_COLUMNS = [
  { accessorKey: "fullName", header: "Client" },
  { accessorKey: "created", header: "Created" },
  { accessorKey: "rmRemarks", header: "RM remarks" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "phase", header: "Phase" },
];

const formatCreated = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const toRow = (client) => {
  const isIndividual = (client.onboardingType || "individual") === "individual";
  const cfg = isIndividual ? getPhaseConfig(client) : null;
  return {
    client,
    cfg,
    fullName: client.fullName || client.username || "—",
    created: formatCreated(client.createdAt),
    rmRemarks: client.rmRemarks || "",
    status: STATUS_LABEL[client.status || "ongoing"] || client.status,
    statusKey: client.status || "ongoing",
    phase: cfg ? `Phase ${cfg.phase} · ${cfg.name}` : "—",
  };
};

const getRowId = (row) => String(row.client.profileId || row.client.userId);

const COLLAPSED_LINES = 3;

function Remarks({ text }) {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  // Explicit px height is needed to animate; "none" afterwards so reflow can't clip text.
  const [fullHeight, setFullHeight] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 0;
      setOverflowing(el.scrollHeight > lineHeight * COLLAPSED_LINES + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  if (!text) return <div className="onbs-remarks muted">No remarks added</div>;

  const toggle = (e) => {
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    if (!expanded) {
      setFullHeight(el.scrollHeight);
      setExpanded(true);
      return;
    }
    // Re-pin to px first (max-height can't animate from "none"), then collapse.
    setFullHeight(el.scrollHeight);
    setUnlocked(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(false)));
  };

  let maxHeight = `${COLLAPSED_LINES * 1.5}em`;
  if (expanded) maxHeight = unlocked ? "none" : `${fullHeight}px`;

  return (
    <div>
      <div
        ref={ref}
        className="onbs-remarks"
        style={{ maxHeight }}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && e.propertyName === "max-height" && expanded) {
            setUnlocked(true);
          }
        }}
      >
        {text}
      </div>
      {overflowing && (
        <button
          type="button"
          className="onbs-read-more"
          onClick={toggle}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function TickIcon() {
  return (
    <span className="onbs-tick" aria-hidden="true">
      <svg viewBox="0 0 12 12" width="10" height="10">
        <path
          d="M2.5 6.2l2.2 2.2 4.8-4.8"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// A phase counts as done once the client has submitted it (or the whole form).
function PhaseTimeline({ client }) {
  const completed = new Set(
    (client.onboarding?.completedSteps || []).map((n) => Number(n))
  );
  const formDone = ["submitted", "approved"].includes(client.onboarding?.status);
  const currentPhase = getPhaseConfig(client).phase;
  // Prerequisites aren't saved; infer them only after the client moves past them.
  const prerequisitesDone = completed.size > 0 || currentPhase > 1;
  const isDone = (phase) =>
    formDone || (phase === 0 ? prerequisitesDone : completed.has(phase));
  const phaseState = (phase) =>
    isDone(phase) ? "done" : phase === currentPhase ? "current" : "pending";

  return (
    <div className="onbs-tl-scroll" tabIndex={0} role="region" aria-label="Onboarding phases and submitted sections">
      <div className="onbs-tl">
        <div className="onbs-tl-head">
          {TIMELINE_PHASES.map((p) => (
            <div
              key={p.phase}
              className={`onbs-tl-phase ${phaseState(p.phase)}`}
              aria-current={phaseState(p.phase) === "current" ? "step" : undefined}
              title={`Phase ${p.phase} · ${p.name}: ${isDone(p.phase) ? "Submitted" : phaseState(p.phase) === "current" ? "Current phase" : "Not submitted yet"}`}
            >
              <span className="onbs-tl-number">{p.phase}</span>
              <span className="onbs-tl-phase-name">{p.name}</span>
            </div>
          ))}
        </div>
        <div className="onbs-tl-grid">
          {TIMELINE_PHASES.map((p) => (
            <div className="onbs-tl-col" key={p.phase}>
              {(PHASE_SECTIONS[p.phase] || []).map((section) => (
                <div
                  key={section}
                  className={`onbs-tag ${phaseState(p.phase)}`}
                  title={isDone(p.phase) ? "Submitted" : "Not submitted yet"}
                >
                  {isDone(p.phase) ? <TickIcon /> : <span className="onbs-pending-dot" aria-hidden="true" />}
                  <span>{section}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusMenu({ current, busy, clientName, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="onbs-status-menu" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="management-row-action is-neutral"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={busy}
        onClick={() => setOpen((v) => !v)}
        data-log-title={`Change Status button clicked: ${clientName}`}
      >
        {busy ? "Updating…" : "Change status ▾"}
      </button>
      {open && (
        <ul className="onbs-status-list" role="menu">
          {STATUS_OPTIONS.map((o) => (
            <li key={o.value} role="none">
              <button
                type="button"
                role="menuitem"
                className={o.value === current ? "active" : ""}
                onClick={() => {
                  setOpen(false);
                  if (o.value !== current) onSelect(o.value);
                }}
                data-log-title={`Set client status to ${o.label}: ${clientName}`}
              >
                <span
                  className="onbs-status-dot"
                  style={{ backgroundColor: o.dot }}
                />
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ClientDetails({ row }) {
  const details = [
    ["Full name", row.fullName],
    ["Email", row.client.email],
    ["Phone", row.client.phone],
    [
      "Onboarding type",
      onboardingTypeLabel(row.client.onboardingType || "individual"),
    ],
    ["Relationship manager", row.client.assignedToName],
    ["Shared with", (row.client.sharedWithNames || []).join(", ")],
    ["Company", row.client.companyName],
    ["Assigned by", row.client.assignedByName],
    ["Date added", row.created],
    ["Status", row.status],
    ["Current phase", row.phase],
  ];
  return (
    <div className="onbs-client-details">
      <dl>
        {details.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TimelineDetail({ row, closing, panelId }) {
  const [activeTab, setActiveTab] = useState("timeline");
  const tabs = [
    { key: "timeline", label: "Onboarding Timeline", icon: "chart" },
    { key: "details", label: "Client Details", icon: "file" },
    {
      key: "remarks",
      label: `Remarks (${row.rmRemarks.trim() ? 1 : 0})`,
      icon: "remarks",
    },
  ];

  const moveTab = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActiveTab(tabs[next].key);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  return (
    <div
      id={panelId}
      className={closing ? "onbs-detail-wrap closing" : "onbs-detail-wrap"}
      inert={closing ? "" : undefined}
    >
      <div className="onbs-detail">
        <div
          className="onbs-tabs"
          role="tablist"
          aria-label={`Onboarding information for ${row.fullName}`}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              id={`${panelId}-tab-${tab.key}`}
              type="button"
              role="tab"
              className={`onbs-tab${activeTab === tab.key ? " active" : ""}`}
              aria-selected={activeTab === tab.key}
              aria-controls={`${panelId}-${tab.key}`}
              tabIndex={activeTab === tab.key ? 0 : -1}
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(event) => moveTab(event, index)}
            >
              {tab.icon === "remarks" ? (
                <RemarksIcon />
              ) : (
                <Icon name={tab.icon} size={18} />
              )}
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            id={`${panelId}-${tab.key}`}
            className="onbs-tab-panel"
            role="tabpanel"
            aria-labelledby={`${panelId}-tab-${tab.key}`}
            hidden={activeTab !== tab.key}
            tabIndex={0}
          >
            {activeTab === tab.key && (
              tab.key === "timeline" ? (
                row.cfg ? (
                  <PhaseTimeline client={row.client} />
                ) : (
                  <div className="onbs-empty">
                    The phase timeline is available for individual onboarding only.
                  </div>
                )
              ) : tab.key === "details" ? (
                <ClientDetails row={row} />
              ) : (
                <div className="onbs-remarks-panel">
                  <h3>RM Remarks</h3>
                  <Remarks text={row.rmRemarks} />
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RemarksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H5l-3 2v-5a8.5 8.5 0 0 1-1-4V11a8 8 0 0 1 8-8h4a8 8 0 0 1 8 8zM6 9h10M6 13h7" />
    </svg>
  );
}

function OnboardingToolbar({
  filterField,
  setFilterField,
  filterValue,
  setFilterValue,
  statusFilter,
  setStatusFilter,
  phaseFilter,
  setPhaseFilter,
}) {
  const selects = [
    {
      label: "Filter onboarding status by field",
      value: filterField,
      onChange: setFilterField,
      options: [
        { value: "all", label: "All Fields" },
        ...FILTER_COLUMNS.map((column) => ({
          value: column.accessorKey,
          label: column.header,
        })),
      ],
    },
    {
      label: "Filter by onboarding status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [{ value: "all", label: "All Statuses" }, ...STATUS_OPTIONS],
    },
    {
      label: "Filter by onboarding phase",
      value: phaseFilter,
      onChange: setPhaseFilter,
      options: [
        { value: "all", label: "All Phases" },
        ...PHASE_CONFIG.map((phase) => ({
          value: String(phase.phase),
          label: `Phase ${phase.phase} · ${phase.name}`,
        })),
      ],
    },
  ];
  return (
    <div className="onbs-toolbar">
      {selects.map((select) => (
        <div className="management-filter-select" key={select.label}>
          <select
            aria-label={select.label}
            value={select.value}
            onChange={(event) => select.onChange(event.target.value)}
          >
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={16} />
        </div>
      ))}
      <div className="management-filter-search">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="7" />
          <path d="m16 16 5 5" />
        </svg>
        <input
          type="search"
          aria-label="Search onboarding status"
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          placeholder="Search clients by name, status, phase, or remarks..."
        />
      </div>
    </div>
  );
}

function ClientRow({
  row,
  isOpen,
  closing,
  updating,
  isSupervisor,
  onToggle,
  onStatusChange,
  onNavigate,
  fallbackRM,
}) {
  const panelId = useId();
  const summaryRef = useRef(null);
  const expanded = isOpen && !closing;
  const colors = STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing;
  const chevron = (
    <Icon
      name="chevronDown"
      size={15}
      className={`onbs-chevron${expanded ? " is-expanded" : ""}`}
    />
  );
  return (
    <article className={`onbs-block${expanded ? " is-open" : ""}`}>
      <div className={`onbs-item${expanded ? " open" : ""}`}>
        <button
          ref={summaryRef}
          type="button"
          className="onbs-client-summary"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={isOpen ? panelId : undefined}
          aria-label={`${expanded ? "Collapse" : "Expand"} onboarding for ${row.fullName}`}
        >
          <span className="onbs-expand-icon">{chevron}</span>
          <span className="onbs-avatar">
            <Icon name="users" size={21} />
          </span>
          <span className="onbs-identity">
            <span className="onbs-name-line">
              <span className="onbs-name">{row.fullName}</span>
              <span className="onbs-type-capsule">
                {onboardingTypeLabel(row.client.onboardingType || "individual")}
              </span>
            </span>
            <span className="onbs-meta">
              {expanded ? "Added " : ""}{row.created}
              <span aria-hidden="true"> · </span>
              RM: {row.client.assignedToName || fallbackRM || "Unassigned"}
            </span>
          </span>
        </button>
        <div className="onbs-progress">
          <span className="onbs-progress-title">Overall Progress</span>
          <div className="onbs-progress-content">
            <span className="onbs-progress-pct">
              {row.cfg ? `${row.cfg.pct}%` : "—"}
            </span>
            <div
              className="onbs-progress-track"
              role="progressbar"
              aria-label={`Onboarding progress for ${row.fullName}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={row.cfg?.pct}
              aria-valuetext={row.cfg ? `${row.cfg.pct}%` : "Progress unavailable"}
            >
              <div
                className="onbs-progress-fill"
                style={{ width: `${row.cfg?.pct || 0}%` }}
              />
            </div>
          </div>
        </div>
        <div className="onbs-capsules">
          <span
            className="onbs-status-capsule"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              borderColor: colors.border,
            }}
          >
            <span
              className="onbs-status-dot"
              style={{ backgroundColor: colors.text }}
            />
            {row.status}
          </span>
          {row.cfg && (
            <span
              className="onbs-phase-capsule"
              title={`Phase ${row.cfg.phase} of 6: ${row.cfg.name}`}
            >
              <Icon name="file" size={17} />
              Phase {row.cfg.phase} · {row.cfg.name}
            </span>
          )}
        </div>
        <div className="onbs-actions">
          {expanded ? (
            <>
              {isSupervisor ? (
                <>
                  <button
                    type="button"
                    className="management-row-action is-neutral"
                    disabled
                    title="RM notifications are not available yet"
                  >
                    <Icon name="mail" size={15} />
                    Notify RM
                  </button>
                  <button
                    type="button"
                    className="management-row-action is-edit"
                    onClick={() => onNavigate?.("submissions")}
                    data-log-title={`Submissions button clicked (timeline): ${row.fullName}`}
                  >
                    <Icon name="file" size={15} />
                    Submissions
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="management-row-action is-neutral onbs-email-btn"
                    disabled={!row.client.email}
                    title={row.client.email ? `Email ${row.client.email}` : "No email on file"}
                    onClick={() => {
                      window.location.href = `mailto:${row.client.email}`;
                    }}
                    data-log-title={`Email Client button clicked (timeline): ${row.fullName}`}
                  >
                    <Icon name="mail" size={15} />
                    Email Client
                  </button>
                  <button
                    type="button"
                    className="management-row-action is-danger"
                    disabled
                    title="Supervisor reporting is not available yet"
                  >
                    <Icon name="file" size={15} />
                    Report Supervisor
                  </button>
                </>
              )}
              <button
                type="button"
                className="management-row-action is-neutral onbs-collapse"
                onClick={() => {
                  summaryRef.current?.focus();
                  onToggle();
                }}
                aria-expanded={expanded}
                aria-controls={panelId}
              >
                Collapse {chevron}
              </button>
            </>
          ) : (
            <>
              {!isSupervisor && (
                <StatusMenu
                  current={row.statusKey}
                  busy={updating}
                  clientName={row.fullName}
                  onSelect={onStatusChange}
                />
              )}
              <button
                type="button"
                className="management-row-action is-edit"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-controls={isOpen ? panelId : undefined}
                data-log-title={`Details button clicked: ${row.fullName}`}
              >
                <Icon name="file" size={15} />
                Details
              </button>
              <span className="onbs-row-chevron" aria-hidden="true">
                {chevron}
              </span>
            </>
          )}
        </div>
      </div>
      {isOpen && <TimelineDetail row={row} closing={closing} panelId={panelId} />}
    </article>
  );
}

export default function OnboardingStatusPage({ onNavigate }) {
  const { user } = useUser();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [openId, setOpenId] = useState(null);
  const [closing, setClosing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Keeps the panel mounted for the length of the close animation (matches CSS).
  const toggleRow = (id) => {
    clearTimeout(closeTimer.current);
    if (openId === id && !closing) {
      setClosing(true);
      closeTimer.current = setTimeout(() => {
        setOpenId(null);
        setClosing(false);
      }, CLOSE_MS);
    } else {
      setClosing(false);
      setOpenId(id);
    }
  };

  const changeStatus = async (row, status) => {
    const id = getRowId(row);
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch(`/api/clients?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.client) throw new Error(data?.error || "Failed to update status");
      setClients((prev) =>
        prev.map((c) => (String(c.profileId || c.userId) === id ? data.client : c))
      );
    } catch (err) {
      setError(err?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/clients", { credentials: "include", cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to fetch onboarding status");
        if (isMounted) setClients(data.clients || []);
      } catch (err) {
        if (isMounted) {
          setClients([]);
          setError(err?.message || "Failed to fetch onboarding status");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (user) load();
    else setLoading(false);
    return () => {
      isMounted = false;
    };
  }, [user]);

  const rows = useMemo(
    () =>
      clients
        .filter((c) => ENGAGED_STATUSES.has(c.status || "ongoing"))
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .map(toRow),
    [clients]
  );

  const filteredRows = useMemo(() => {
    const needle = filterValue.trim().toLowerCase();
    const fields = filterField === "all" ? FILTERABLE_FIELDS : [filterField];
    return rows.filter((row) =>
      (statusFilter === "all" || row.statusKey === statusFilter) &&
      (phaseFilter === "all" || String(row.cfg?.phase) === phaseFilter) &&
      (!needle || fields.some((field) => String(row[field] ?? "").toLowerCase().includes(needle)))
    );
  }, [rows, filterField, filterValue, statusFilter, phaseFilter]);

  useEffect(() => {
    setPageIndex(0);
  }, [filterField, filterValue, statusFilter, phaseFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentIndex = Math.min(pageIndex, pageCount - 1);
  const pageRows = filteredRows.slice(currentIndex * PAGE_SIZE, (currentIndex + 1) * PAGE_SIZE);

  return (
    <TablePageLayout
      title="Onboarding Status"
      description="Track how far each of your clients has progressed through onboarding."
      className="onboarding-status-table-page"
      loading={loading}
    >
      <OnboardingToolbar
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        phaseFilter={phaseFilter}
        setPhaseFilter={setPhaseFilter}
      />

      {error ? <div className="onbs-error">{error}</div> : null}

      {loading ? <GenericTableLoader /> : pageRows.length === 0 ? (
        <div className="onbs-empty">
          {error ? "" : rows.length === 0 ? "No clients are currently going through onboarding." : "No clients match your filters."}
        </div>
      ) : (
        <div className="onbs-list">
          {pageRows.map((row) => {
            const id = getRowId(row);
            return (
              <ClientRow
                key={id}
                row={row}
                isOpen={openId === id}
                closing={closing}
                updating={updatingId === id}
                isSupervisor={user?.role === "supervisor"}
                onToggle={() => toggleRow(id)}
                onStatusChange={(status) => changeStatus(row, status)}
                onNavigate={onNavigate}
                fallbackRM={user?.role === "rm" ? user.fullName || user.username : ""}
              />
            );
          })}
        </div>
      )}

      {!loading && (
        <ManagementTablePagination
          pagination={{ pageIndex: currentIndex, pageSize: PAGE_SIZE }}
          total={filteredRows.length}
          onPageChange={setPageIndex}
        />
      )}
    </TablePageLayout>
  );
}
