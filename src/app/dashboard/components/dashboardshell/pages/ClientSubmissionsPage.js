"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import GenericTableHeader from "./pagecomponents/generictablecomps/generictableheader";
import { buildDummySubmissions } from "./submissions/dummySubmissions";
import SubmissionViewModal from "./submissions/SubmissionViewModal";
import PhaseRow from "./submissions/PhaseRow";
import "./styles/generictable.css";
import "./styles/submissions.css";

// The client's own submitted phases only (no client accordion, no filters).
export default function ClientSubmissionsPage() {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null);

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

  if (loading) return <GenericTableLoader />;

  const ownerName = user?.fullName || user?.username || "You";

  return (
    <div className="generic-table-container">
      <GenericTableHeader
        title="Submissions"
        description="Here you can view all the phases you have submitted."
        hideDefaultFilter
      />

      {error ? <div className="sub-error">{error}</div> : null}

      {submissions.length === 0 ? (
        <div className="sub-empty">{error ? "" : "You have not submitted any phases yet."}</div>
      ) : (
        <div className="sub-list sub-list-tight">
          {submissions.map((s) => (
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
    </div>
  );
}
