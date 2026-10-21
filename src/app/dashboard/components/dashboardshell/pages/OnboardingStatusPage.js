"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import TablePageLayout from "./pagecomponents/TablePageLayout";
import ManagementTableToolbar from "./pagecomponents/ManagementTableToolbar";
import ManagementTablePagination from "./pagecomponents/ManagementTablePagination";
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
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
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
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 0;
    setOverflowing(el.scrollHeight > lineHeight * COLLAPSED_LINES + 1);
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
  // Prerequisites aren't saved; they count as read once the client has moved past them.
  const prerequisitesDone =
    completed.size > 0 || (Number(client.onboarding?.currentStep) || 1) > 1;
  const isDone = (phase) =>
    formDone || (phase === 0 ? prerequisitesDone : completed.has(phase));

  return (
    <div className="onbs-tl-scroll">
      <div className="onbs-tl">
        <div className="onbs-tl-head">
          {TIMELINE_PHASES.map((p, i) => (
            <div
              key={p.phase}
              className={isDone(p.phase) ? "onbs-tl-phase done" : "onbs-tl-phase"}
            >
              <span className="onbs-tl-phase-num">Phase {p.phase}</span>
              <span className="onbs-tl-phase-name">{p.name}</span>
              <div className="onbs-tl-track">
                <span className="onbs-tl-dot start" />
                {i === TIMELINE_PHASES.length - 1 && <span className="onbs-tl-dot end" />}
              </div>
            </div>
          ))}
        </div>

        <div className="onbs-tl-grid">
          {TIMELINE_PHASES.map((p) => {
            const done = isDone(p.phase);
            return (
              <div className="onbs-tl-col" key={p.phase}>
                {(PHASE_SECTIONS[p.phase] || []).map((section) => (
                  <div
                    key={section}
                    className={done ? "onbs-tag done" : "onbs-tag pending"}
                    title={done ? "Submitted" : "Not submitted yet"}
                  >
                    {done && <TickIcon />}
                    <span>{section}</span>
                  </div>
                ))}
              </div>
            );
          })}
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

function TimelineDetail({ row, closing, isSupervisor, onNavigate }) {
  return (
    <div className={closing ? "onbs-detail-wrap closing" : "onbs-detail-wrap"}>
      <div className="onbs-detail">
        <div className="onbs-detail-body">
          <div className="onbs-detail-actions">
            {isSupervisor ? (
              <>
                <button
                  type="button"
                  className="management-row-action is-edit"
                  data-log-title={`Notify RM button clicked: ${row.fullName}`}
                >
                  Notify RM
                </button>
                <button
                  type="button"
                  className="management-row-action is-edit"
                  onClick={() => onNavigate?.("submissions")}
                  data-log-title={`Submissions button clicked (timeline): ${row.fullName}`}
                >
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
                    if (row.client.email) window.location.href = `mailto:${row.client.email}`;
                  }}
                  data-log-title={`Email Client button clicked (timeline): ${row.fullName}`}
                >
                  Email {row.fullName}
                </button>
                <button
                  type="button"
                  className="management-row-action is-danger"
                  data-log-title={`Report Supervisor button clicked: ${row.fullName}`}
                >
                  Report Supervisor
                </button>
              </>
            )}
          </div>
          <h3 className="onbs-detail-title">Onboarding Timeline</h3>
          <h4 className="onbs-detail-client">{row.fullName}</h4>
          <div className="onbs-detail-date">Date added: {row.created}</div>
          <div className="onbs-capsules onbs-detail-capsules">
            {isSupervisor && row.client.assignedToName && (
              <span
                className="onbs-rm-tag"
                title="The relationship manager this client is assigned to"
              >
                Assigned RM: {row.client.assignedToName}
              </span>
            )}
            {isSupervisor && (row.client.sharedWithNames || []).length > 0 && (
              <span
                className="onbs-shared-tag"
                title="Other relationship managers this client is shared with"
              >
                Shared with: {row.client.sharedWithNames.join(", ")}
              </span>
            )}
            <span
              className="onbs-status-capsule"
              title="Current onboarding status of this client"
              style={{
                backgroundColor: (STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing).bg,
                color: (STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing).text,
                borderColor: (STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing).border,
              }}
            >
              {row.status}
            </span>
            {row.cfg && (
              <span
                className="onbs-phase-capsule"
                title={`The onboarding phase the client is currently on (Phase ${row.cfg.phase} of 6)`}
              >
                Phase {row.cfg.phase} · {row.cfg.name}
              </span>
            )}
            <span
              className="onbs-type-capsule"
              title="The type of client being onboarded"
            >
              {onboardingTypeLabel(row.client.onboardingType || "individual")}
            </span>
          </div>
          <div className="onbs-detail-remarks">
            <Remarks text={row.rmRemarks} />
          </div>

          {row.cfg ? (
            <PhaseTimeline client={row.client} />
          ) : (
            <div className="onbs-empty">
              The phase timeline is available for individual onboarding only.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingStatusPage({ onNavigate }) {
  const { user } = useUser();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [filterValue, setFilterValue] = useState("");
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
    if (!needle) return rows;
    const fields = filterField === "all" ? FILTERABLE_FIELDS : [filterField];
    return rows.filter((r) =>
      fields.some((f) => String(r[f] ?? "").toLowerCase().includes(needle))
    );
  }, [rows, filterField, filterValue]);

  useEffect(() => {
    setPageIndex(0);
  }, [filterField, filterValue]);

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
      <ManagementTableToolbar
        title="Onboarding Status"
        columns={FILTER_COLUMNS}
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterableFields={FILTERABLE_FIELDS}
        searchPlaceholder="Search clients by name, status, phase, or remarks..."
      />

      {error ? <div className="onbs-error">{error}</div> : null}

      {loading ? <GenericTableLoader /> : pageRows.length === 0 ? (
        <div className="onbs-empty">
          {error ? "" : "No clients are currently going through onboarding."}
        </div>
      ) : (
        <div className="onbs-list">
          <div className="onbs-list-heading" aria-hidden="true">
            <span>Client &amp; progress</span>
            <span>Status &amp; phase</span>
            <span>Actions</span>
          </div>
          {pageRows.map((row) => {
            const id = getRowId(row);
            const isOpen = openId === id;
            const toggle = () => toggleRow(id);
            return (
            <div className="onbs-block" key={id}>
            <div
              className={isOpen && !closing ? "onbs-item open" : "onbs-item"}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={toggle}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle();
                }
              }}
            >
              <div className="onbs-main">
                <div className="onbs-date">{row.created}</div>
                <div className="onbs-name">{row.fullName}</div>

                <div className="onbs-progress">
                  <div className="onbs-progress-head">
                    <span className="onbs-progress-title">Progress</span>
                    <span className="onbs-progress-pct">{row.cfg ? `${row.cfg.pct}%` : "—"}</span>
                  </div>
                  <div
                    className="onbs-progress-track"
                    role="progressbar"
                    aria-label={`Onboarding progress for ${row.fullName}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={row.cfg ? row.cfg.pct : 0}
                  >
                    <div
                      className="onbs-progress-fill"
                      style={{ width: `${row.cfg ? row.cfg.pct : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="onbs-capsules">
                <span
                  className="onbs-status-capsule"
                  style={{
                    backgroundColor: (STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing).bg,
                    color: (STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing).text,
                    borderColor: (STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing).border,
                  }}
                >
                  {row.status}
                </span>
                {row.cfg ? (
                  <span
                    className="onbs-phase-capsule"
                    title={`Phase ${row.cfg.phase} of 6: ${row.cfg.name}`}
                  >
                    Phase {row.cfg.phase} · {row.cfg.name}
                  </span>
                ) : null}
              </div>

              <div className="onbs-actions">
                {user?.role !== "supervisor" && (
                  <StatusMenu
                    current={row.statusKey}
                    busy={updatingId === id}
                    clientName={row.fullName}
                    onSelect={(status) => changeStatus(row, status)}
                  />
                )}
                <button
                  type="button"
                  className="management-row-action is-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                  data-log-title={`Details button clicked: ${row.fullName}`}
                >
                  Details
                </button>
              </div>
            </div>
            {isOpen && (
              <TimelineDetail
                row={row}
                closing={closing}
                isSupervisor={user?.role === "supervisor"}
                onNavigate={onNavigate}
              />
            )}
            </div>
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
