"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ClientInfoModal from "./ClientInfoModal";
import { ClientStatusBadge, STATUS_LABELS, onboardingTypeLabel, actionBtnStyle } from "./clientStatusShared";
import { logUIAction } from "@/lib/logUIAction";

const VERIFY_URL = "https://www.nemesisam.com/";

export default function ApprovalsPage() {
  const { user } = useUser();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoClient, setInfoClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/clients?status=approval_pending", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to fetch approvals");
        if (isMounted) setClients(data.clients || []);
      } catch (err) {
        if (isMounted) {
          setClients([]);
          setError(err?.message || "Failed to fetch approvals");
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

  const getId = (client) => client?.profileId || client?.userId || client?._id || null;

  const removeFromList = (client) =>
    setClients((prev) => prev.filter((c) => String(getId(c)) !== String(getId(client))));

  const handleVerify = (client) => {
    window.open(VERIFY_URL, "_blank", "noopener,noreferrer");
    logUIAction("verify_client", {
      title: `Opened Nemesis verification for client: ${client.fullName || client.email}`,
      entityType: "client",
      entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
    });
  };

  const openInfo = (client) => {
    setInfoClient(client);
    logUIAction("view_client_info", {
      title: `Viewed pending client info: ${client.fullName || client.email}`,
      entityType: "client",
      entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
    });
  };

  const handleEmail = (client) => {
    if (client.email) window.location.href = `mailto:${client.email}`;
  };

  const handleReview = async (client) => {
    const id = getId(client);
    if (!id || reviewingId) return;
    setReviewingId(id);
    try {
      const res = await fetch(`/api/clients?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "review" }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(result?.error || "Failed to move client to review");
        return;
      }
      removeFromList(client);
      setInfoClient(null);
      logUIAction("record_updated", {
        title: `Moved client to under review: ${client.fullName || client.email}`,
        entityType: "client",
        entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
      });
    } finally {
      setReviewingId(null);
    }
  };

  const handleApprove = async (client) => {
    const id = getId(client);
    if (!id || approvingId) return;
    setApprovingId(id);
    try {
      const res = await fetch(`/api/clients?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "approve" }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(result?.error || "Failed to approve client");
        return;
      }
      removeFromList(client);
      setInfoClient(null);
      logUIAction("record_updated", {
        title: `Approved client: ${client.fullName || client.email}`,
        entityType: "client",
        entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
      });
    } finally {
      setApprovingId(null);
    }
  };

  const performDelete = async (client) => {
    const id = getId(client);
    if (!id) return;
    const res = await fetch(`/api/clients?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      window.alert(result?.error || "Failed to delete client");
      return;
    }
    removeFromList(client);
    logUIAction("record_deleted", {
      title: `Deleted pending client: ${client.fullName || client.email}`,
      entityType: "client",
      entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
    });
  };

  const columns = [
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "status",
      header: "Status",
      accessorFn: (row) => STATUS_LABELS[row.status] || row.status,
      cell: ({ row }) => <ClientStatusBadge status={row.original.status} />,
    },
    {
      id: "onboardingType",
      header: "Onboarding Type",
      accessorFn: (row) => onboardingTypeLabel(row.onboardingType),
      cell: ({ row }) => onboardingTypeLabel(row.original.onboardingType),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const client = row.original;
        const label = client.fullName || client.email || client._id;
        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => openInfo(client)}
              title="Show client details"
              data-log-title={`Details Approval button clicked: ${label}`}
              className="dash-action-btn dash-btn-green"
              style={actionBtnStyle}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(client)}
              title="Delete client"
              data-log-title={`Delete Approval button clicked: ${label}`}
              className="dash-action-btn dash-btn-danger"
              style={actionBtnStyle}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {error ? (
        <div
          style={{
            marginBottom: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            backgroundColor: "#fee2e2",
            color: "#7f1d1d",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      ) : null}

      <GenericTable
        title="Approvals"
        description="Clients added by your RMs that are waiting for your approval are displayed here."
        data={clients}
        columns={columns}
        filterableFields={columns.filter((col) => col.accessorKey).map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
        disableRowModal
      />

      <ClientInfoModal
        client={infoClient}
        onClose={() => setInfoClient(null)}
        footerActions={
          infoClient ? (
            <>
              <button
                type="button"
                onClick={() => handleEmail(infoClient)}
                disabled={!infoClient.email}
                title={infoClient.email ? `Email ${infoClient.email}` : "No email on file"}
                data-log-title={`Email Client button clicked (approvals modal): ${infoClient.fullName || infoClient.email}`}
                className="dash-action-btn dash-btn-neutral"
                style={actionBtnStyle}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => handleVerify(infoClient)}
                title="Verify on Nemesis"
                data-log-title={`Verify Client button clicked (approvals modal): ${infoClient.fullName || infoClient.email}`}
                className="dash-action-btn dash-btn-info"
                style={actionBtnStyle}
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => handleReview(infoClient)}
                disabled={reviewingId === getId(infoClient)}
                title="Move this client to Under review"
                data-log-title={`Review Client button clicked: ${infoClient.fullName || infoClient.email}`}
                className="dash-action-btn dash-btn-purple"
                style={actionBtnStyle}
              >
                Review
              </button>
              <button
                type="button"
                onClick={() => handleApprove(infoClient)}
                disabled={approvingId === getId(infoClient)}
                title="Approve client for onboarding"
                data-log-title={`Approve Client button clicked (approvals modal): ${infoClient.fullName || infoClient.email}`}
                className="dash-action-btn dash-btn-green"
                style={actionBtnStyle}
              >
                Approve
              </button>
            </>
          ) : null
        }
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        itemLabel={
          deleteTarget ? `client "${deleteTarget.fullName || ""}"` : "this client"
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await performDelete(deleteTarget);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
