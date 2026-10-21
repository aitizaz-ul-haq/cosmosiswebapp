"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import TablePageLayout from "./pagecomponents/TablePageLayout";
import ManagementTableToolbar from "./pagecomponents/ManagementTableToolbar";
import { buildDummySubmissions } from "./submissions/dummySubmissions";
import SubmissionViewModal from "./submissions/SubmissionViewModal";
import PhaseRow from "./submissions/PhaseRow";
import "./styles/generictable.css";
import "./styles/submissions.css";

const FILTERABLE_FIELDS = ["phase", "name", "status"];
const FILTER_COLUMNS = [
  { accessorKey: "phase", header: "Phase number" },
  { accessorKey: "name", header: "Phase name" },
  { accessorKey: "status", header: "Status" },
];

// The client's own submitted phases only, without the staff client accordion.
export default function ClientSubmissionsPage() {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null);
  const [filterField, setFilterField] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/clients/me", { credentials: "include", cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data?.error || "Failed to fetch submissions");
        if (isMounted) {
          setSubmissions(
            buildDummySubmissions({
              onboardingType: data.onboardingType,
              onboarding: data.onboarding,
              createdAt: data.profile?.createdAt,
            })
          );
        }
      } catch (err) {
        if (isMounted) setError(err?.message || "Failed to fetch submissions");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSubmissions = useMemo(() => {
    const needle = filterValue.trim().toLowerCase();
    if (!needle) return submissions;
    const fields = filterField === "all" ? FILTERABLE_FIELDS : [filterField];
    return submissions.filter((submission) => fields.some((field) => {
      const value = field === "status"
        ? submission.completed ? "Completed" : "In progress"
        : submission[field];
      return String(value ?? "").toLowerCase().includes(needle);
    }));
  }, [submissions, filterField, filterValue]);

  const ownerName = user?.fullName || user?.username || "You";

  return (
    <TablePageLayout
      title="Submissions"
      description="Here you can view all the phases you have submitted."
      className="client-submissions-table-page"
      loading={loading}
    >
      <ManagementTableToolbar
        title="Submissions"
        columns={FILTER_COLUMNS}
        filterableFields={FILTERABLE_FIELDS}
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        searchPlaceholder="Search submissions by phase, name, or status..."
      />

      {error ? <div className="sub-error">{error}</div> : null}

      {loading ? <GenericTableLoader /> : filteredSubmissions.length === 0 ? (
        <div className="sub-empty">{error ? "" : submissions.length === 0 ? "You have not submitted any phases yet." : "No submissions match your search."}</div>
      ) : (
        <div className="sub-list sub-list-tight" role="region" aria-label="Submitted phases" tabIndex={0}>
          <div className="sub-phase-list-heading" aria-hidden="true">
            <span />
            <span>#</span>
            <span>Phase</span>
            <span>Completed at</span>
            <span>Progress</span>
            <span>Actions</span>
          </div>
          {filteredSubmissions.map((s) => (
            <PhaseRow
              key={s.phase}
              submission={s}
              logLabel={ownerName}
              onView={(sub) => setViewing(sub)}
            />
          ))}
        </div>
      )}

      {viewing ? (
        <SubmissionViewModal
          clientName={ownerName}
          clientActions
          submission={viewing}
          onClose={() => setViewing(null)}
        />
      ) : null}
    </TablePageLayout>
  );
}
