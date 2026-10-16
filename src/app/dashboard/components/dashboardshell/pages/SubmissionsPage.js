"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import GenericTableHeader from "./pagecomponents/generictablecomps/generictableheader";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  actionBtnStyle,
  getPhaseConfig,
} from "./clientStatusShared";
import { buildDummySubmissions } from "./submissions/dummySubmissions";
import SubmissionViewModal from "./submissions/SubmissionViewModal";
import PasswordGate from "./submissions/PasswordGate";
import "./styles/generictable.css";
import "./styles/submissions.css";

const PAGE_SIZE = 8;
// Same clients as the Onboarding status page: those actively going through onboarding.
const ENGAGED_STATUSES = new Set(["ongoing", "on_hold", "cancelled"]);
const FILTERABLE_FIELDS = ["username", "status", "phase"];

const getRowId = (client) => String(client.profileId || client.userId);

const formatCreated = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const formatCompletedAt = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
    phaseLabel: cfg ? `${cfg.phase} · ${cfg.name}` : "—",
    submissions: buildDummySubmissions(client),
  };
};

function TickIcon() {
  return (
    <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true">
      <path
        d="M2.5 6.2l2.2 2.2 4.8-4.8"
        fill="none"
        stroke="#17b89b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SubmissionAccordion({ row, open, onToggle, onView }) {
  const colors = STATUS_COLORS[row.statusKey] || STATUS_COLORS.ongoing;
  return (
    <div className={open ? "sub-acc open" : "sub-acc"}>
      <button
        type="button"
        className="sub-acc-head"
        aria-expanded={open}
        onClick={onToggle}
        data-log-title={`Submissions accordion ${open ? "closed" : "opened"}: ${row.username}`}
      >
        <span className="sub-acc-who">
          <span className="sub-acc-user">{row.username}</span>
          <span className="sub-acc-meta">
            <span className="sub-acc-label">Date created</span> {row.created}
          </span>
        </span>
        <span className="sub-acc-progress">
          <span className="sub-acc-meta">
            <span className="sub-acc-label">Current phase</span> {row.phaseLabel}
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
        </span>
        <span className="sub-acc-plus" aria-hidden="true" />
      </button>

      <div className="sub-acc-body" aria-hidden={!open}>
        <div className="sub-acc-inner">
          <div className="sub-acc-list">
            {row.submissions.length === 0 ? (
              <div className="sub-acc-empty">No phases submitted yet.</div>
            ) : (
              row.submissions.map((s) => (
                <div className="sub-phase" key={s.phase}>
                  <span className="sub-phase-tick" aria-label={s.completed ? "Completed" : "In progress"}>
                    {s.completed ? <TickIcon /> : null}
                  </span>
                  <span className="sub-phase-num">{s.phase}</span>
                  <span className="sub-phase-name">{s.name}</span>
                  <span className="sub-phase-when">
                    {s.completedAt ? (
                      <>
                        <span className="sub-acc-label">Completed at</span>{" "}
                        {formatCompletedAt(s.completedAt)}
                      </>
                    ) : (
                      <span className="sub-phase-pending">Still in progress</span>
                    )}
                  </span>
                  <span className="sub-phase-done">
                    {!s.completed
                      ? null
                      : s.sections.length === s.totalSections
                        ? `All sub-sections completed (${s.totalSections})`
                        : `${s.sections.length} of ${s.totalSections} sub-sections completed`}
                  </span>
                  <button
                    type="button"
                    className="dash-action-btn dash-btn-green"
                    style={actionBtnStyle}
                    tabIndex={open ? 0 : -1}
                    onClick={() => onView(row, s)}
                    data-log-title={`View submission clicked: ${row.username} - Phase ${s.phase}`}
                  >
                    View
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

  if (unlocked && loading) return <GenericTableLoader />;

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentIndex = Math.min(pageIndex, pageCount - 1);
  const pageRows = filteredRows.slice(currentIndex * PAGE_SIZE, (currentIndex + 1) * PAGE_SIZE);
  const firstRow = filteredRows.length === 0 ? 0 : currentIndex * PAGE_SIZE + 1;
  const lastRow = Math.min(filteredRows.length, (currentIndex + 1) * PAGE_SIZE);

  return (
    <div className="generic-table-container">
      <GenericTableHeader
        title="Submissions"
        description="Here you can view all the phases that have been submitted by your clients."
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterableFields={FILTERABLE_FIELDS}
      />

      {error ? <div className="sub-error">{error}</div> : null}

      {!unlocked ? null : pageRows.length === 0 ? (
        <div className="sub-empty">{error ? "" : "No client submissions to show."}</div>
      ) : (
        <div className="sub-list">
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

      <div className="generic-table-pagination">
        <div className="generic-table-pagination-info">
          Showing {firstRow}-{lastRow} of {filteredRows.length}
        </div>
        <div className="generic-table-pagination-controls">
          <button
            type="button"
            className="generic-table-page-btn"
            onClick={() => setPageIndex(0)}
            disabled={currentIndex === 0}
          >
            First
          </button>
          <button
            type="button"
            className="generic-table-page-btn"
            onClick={() => setPageIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            Prev
          </button>
          <button
            type="button"
            className="generic-table-page-btn"
            onClick={() => setPageIndex(currentIndex + 1)}
            disabled={currentIndex >= pageCount - 1}
          >
            Next
          </button>
          <button
            type="button"
            className="generic-table-page-btn"
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={currentIndex >= pageCount - 1}
          >
            Last
          </button>
        </div>
        <div className="generic-table-pagination-status">
          Page {currentIndex + 1} of {pageCount}
        </div>
      </div>

      {viewing ? (
        <SubmissionViewModal
          clientName={viewing.clientName}
          submission={viewing.submission}
          onClose={() => setViewing(null)}
        />
      ) : null}

      {!unlocked ? <PasswordGate onVerified={() => setUnlocked(true)} /> : null}
    </div>
  );
}
