"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import TablePageLayout from "./pagecomponents/TablePageLayout";
import ManagementTableToolbar from "./pagecomponents/ManagementTableToolbar";
import Icon from "./modalkit/Icon";
import { STATUS_COLORS, STATUS_LABELS, getPhaseConfig } from "./clientStatusShared";
import { buildDummySubmissions } from "./submissions/dummySubmissions";
import SubmissionViewModal from "./submissions/SubmissionViewModal";
import PasswordGate from "./submissions/PasswordGate";
import PhaseRow, { formatCompletedAt } from "./submissions/PhaseRow";
import "./styles/generictable.css";
import "./styles/submissions.css";

const PAGE_SIZE = 8;
// Same clients as the Onboarding status page: those actively going through onboarding.
const ENGAGED_STATUSES = new Set(["ongoing", "on_hold", "cancelled"]);
const FILTERABLE_FIELDS = ["username", "status", "phase"];
const FILTER_COLUMNS = [
  { accessorKey: "username", header: "Client" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "phase", header: "Phase" },
];

const getRowId = (client) => String(client.profileId || client.userId);

const formatCreated = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const toRow = (client) => {
  const isIndividual = (client.onboardingType || "individual") === "individual";
  const cfg = isIndividual ? getPhaseConfig(client) : null;
  const statusKey = client.status || "ongoing";
  return {
    id: getRowId(client),
    client,
    username: client.username || client.fullName || "—",
    created: formatCreated(client.createdAt),
    statusKey,
    status: STATUS_LABELS[statusKey] || statusKey,
    phase: cfg ? `Phase ${cfg.phase} · ${cfg.name}` : "—",
    cfg,
    submissions: buildDummySubmissions(client),
  };
};

function SubmissionActions({ row, open, onToggle, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  const closeMenu = () => {
    setMenuOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const dismiss = (event) => {
      if (event.type === "keydown" && event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      } else if (event.type === "pointerdown" && !ref.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    ref.current?.querySelector('[role="menuitem"]')?.focus();
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismiss);
    };
  }, [menuOpen]);

  const moveMenuFocus = (event) => {
    const items = Array.from(event.currentTarget.querySelectorAll('button:not([disabled])'));
    const index = items.indexOf(document.activeElement);
    let next;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    else if (event.key === "ArrowUp") next = (index + items.length - 1) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <div className="sub-actions" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className="sub-actions-trigger"
        aria-label={`Submission actions for ${row.username}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? menuId : undefined}
        onClick={() => setMenuOpen((previous) => !previous)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
      {menuOpen && (
        <ul
          id={menuId}
          className="sub-actions-menu"
          role="menu"
          aria-label={`Submission actions for ${row.username}`}
          onKeyDown={moveMenuFocus}
        >
          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                closeMenu();
                onToggle();
              }}
            >
              {open ? "Hide submission phases" : "Show submission phases"}
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              disabled={row.submissions.length === 0}
              onClick={() => {
                closeMenu();
                onView(row, row.submissions[row.submissions.length - 1]);
              }}
            >
              View latest phase
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

function SubmissionAccordion({ row, open, onToggle, onView }) {
  const panelId = useId();
  const colors = STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing;
  const activity = row.client.onboarding?.submittedAt;
  const activityLabel = activity && !Number.isNaN(new Date(activity).getTime())
    ? `Last activity ${formatCompletedAt(activity)}`
    : "Last activity unavailable";

  return (
    <article className={open ? "sub-acc open" : "sub-acc"}>
      <div className="sub-acc-head">
        <button
          type="button"
          className="sub-acc-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Hide" : "Show"} submission phases for ${row.username}`}
          onClick={onToggle}
          data-log-title={`Submissions accordion ${open ? "closed" : "opened"}: ${row.username}`}
        >
          <span className="sub-acc-chevron">
            <Icon name="chevronDown" size={17} />
          </span>
          <span className="sub-acc-who">
            <strong className="sub-acc-user">{row.username}</strong>
            <span className="sub-acc-meta">Added · {row.created}</span>
          </span>
        </button>
        <div className="sub-acc-progress">
          <span className="sub-acc-current">
            {row.cfg ? (
              <><strong>Current phase {row.cfg.phase}</strong> · {row.cfg.name}</>
            ) : "Phase tracking unavailable"}
          </span>
          <span
            className="sub-acc-status"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              borderColor: colors.border,
            }}
          >
            {row.status}
          </span>
        </div>
        <time className="sub-acc-created" dateTime={row.client.createdAt || undefined}>
          {row.created}
        </time>
        <SubmissionActions row={row} open={open} onToggle={onToggle} onView={onView} />
      </div>

      <div
        id={panelId}
        className="sub-acc-body"
        role="region"
        aria-label={`Submission phases for ${row.username}`}
        aria-hidden={!open}
        inert={!open ? "" : undefined}
      >
        <div className="sub-acc-inner">
          <div className="sub-acc-card">
            <div className="sub-acc-card-header">
              <h2>Submission phases</h2>
              <span className="sub-last-activity">
                <Icon name="clock" size={15} />{activityLabel}
              </span>
            </div>
            <div className="sub-acc-list">
              {row.submissions.length === 0 ? (
                <div className="sub-acc-empty">No phases submitted yet.</div>
              ) : (
                row.submissions.map((s) => (
                  <PhaseRow
                    key={s.phase}
                    submission={s}
                    variant="staff"
                    focusable={open}
                    logLabel={row.username}
                    onView={(sub) => onView(row, sub)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SubmissionsPagination({ pageIndex, total, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visibleCount = Math.min(5, pageCount);
  const start = Math.max(0, Math.min(pageIndex - Math.floor(visibleCount / 2), pageCount - visibleCount));
  const pages = Array.from({ length: visibleCount }, (_, index) => start + index);
  const firstRow = total === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const lastRow = Math.min(total, (pageIndex + 1) * PAGE_SIZE);

  return (
    <div className="sub-pagination">
      <span className="sub-pagination-info">Showing {firstRow}–{lastRow} of {total}</span>
      <nav className="sub-pagination-controls" aria-label="Submissions pagination">
        <button
          type="button"
          className="sub-page-button is-prev"
          aria-label="Previous page"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          <Icon name="chevronDown" size={16} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`sub-page-button${page === pageIndex ? " active" : ""}`}
            aria-label={`Page ${page + 1}`}
            aria-current={page === pageIndex ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}
        <button
          type="button"
          className="sub-page-button is-next"
          aria-label="Next page"
          disabled={pageIndex === pageCount - 1}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          <Icon name="chevronDown" size={16} />
        </button>
      </nav>
    </div>
  );
}

export default function SubmissionsPage() {
  const { user } = useUser();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [openIds, setOpenIds] = useState(() => new Set());
  const [viewing, setViewing] = useState(null);
  // Asked for again every time the section is opened
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!unlocked) return undefined;
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/clients", { credentials: "include", cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to fetch submissions");
        if (isMounted) setClients(data.clients || []);
      } catch (err) {
        if (isMounted) {
          setClients([]);
          setError(err?.message || "Failed to fetch submissions");
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
  }, [user, unlocked]);

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

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentIndex = Math.min(pageIndex, pageCount - 1);
  const pageRows = filteredRows.slice(currentIndex * PAGE_SIZE, (currentIndex + 1) * PAGE_SIZE);

  return (
    <TablePageLayout
      title="Submissions"
      description="Here you can view all the phases that have been submitted by your clients."
      className="submissions-table-page"
      loading={unlocked && loading}
    >
      <div className="sub-protected-content" aria-hidden={!unlocked} inert={!unlocked ? "" : undefined}>
        <div className="sub-toolbar">
          <ManagementTableToolbar
            title="Submissions"
            columns={FILTER_COLUMNS}
            filterField={filterField}
            setFilterField={setFilterField}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            filterableFields={FILTERABLE_FIELDS}
            searchPlaceholder="Search submissions by client, status, or phase..."
          />
          {unlocked && !loading && (
            <SubmissionsPagination
              pageIndex={currentIndex}
              total={filteredRows.length}
              onPageChange={setPageIndex}
            />
          )}
        </div>

        {error ? <div className="sub-error">{error}</div> : null}

        {unlocked && loading ? <GenericTableLoader /> : !unlocked ? null : pageRows.length === 0 ? (
          <div className="sub-empty">{error ? "" : rows.length === 0 ? "No client submissions to show." : "No submissions match your search."}</div>
        ) : (
          <div className="sub-list">
            <div className="sub-list-heading" aria-hidden="true">
              <span>Client</span>
              <span>Phase &amp; status</span>
              <span>Date created</span>
              <span>Actions</span>
            </div>
            {pageRows.map((row) => (
              <SubmissionAccordion
                key={row.id}
                row={row}
                open={openIds.has(row.id)}
                onToggle={() => toggle(row.id)}
                onView={(r, submission) => setViewing({ clientName: r.username, submission })}
              />
            ))}
          </div>
        )}

      </div>

      {viewing ? (
        <SubmissionViewModal
          clientName={viewing.clientName}
          submission={viewing.submission}
          onClose={() => setViewing(null)}
        />
      ) : null}

      {!unlocked ? <PasswordGate onVerified={() => setUnlocked(true)} /> : null}
    </TablePageLayout>
  );
}
