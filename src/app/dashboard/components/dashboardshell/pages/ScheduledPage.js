"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ScheduledDetailsModal from "./ScheduledDetailsModal";
import { Icon } from "./modalkit/ModalKit";
import {
  ClientStatusBadge,
  STATUS_LABELS,
  onboardingTypeLabel,
} from "./clientStatusShared";
import { formatCompact, getBrowserTimeZone } from "./scheduling/timeUtils";
import { logUIAction } from "@/lib/logUIAction";

export default function ScheduledPage() {
  const { user } = useUser();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoClient, setInfoClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/clients?status=scheduled", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to fetch scheduled onboardings");
        if (isMounted) setClients(data.clients || []);
      } catch (err) {
        if (isMounted) {
          setClients([]);
          setError(err?.message || "Failed to fetch scheduled onboardings");
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
    setClients((prev) => prev.filter((c) => String(getId(c)) !== String(id)));
    logUIAction("record_deleted", {
      title: `Deleted scheduled client: ${client.fullName || client.email}`,
      entityType: "client",
      entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
    });
  };

  const openInfo = (client) => {
    setInfoClient(client);
    logUIAction("view_client_info", {
      title: `Viewed scheduled onboarding details: ${client.fullName || client.email}`,
      entityType: "client",
      entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
    });
  };

  const handleScheduleChanged = (client, next) => {
    setClients((prev) =>
      prev.map((c) => (String(getId(c)) === String(getId(client)) ? { ...c, ...next } : c))
    );
    setInfoClient((prev) => (prev ? { ...prev, ...next } : prev));
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
      id: "scheduledFor",
      header: "Scheduled For",
      accessorFn: (row) =>
        row.scheduledRegistrationAt && row.scheduledTimeZone
          ? formatCompact(new Date(row.scheduledRegistrationAt), row.scheduledTimeZone)
          : "",
      cell: ({ row }) => {
        const c = row.original;
        if (!c.scheduledRegistrationAt || !c.scheduledTimeZone) return "—";
        const at = new Date(c.scheduledRegistrationAt);
        return (
          <span title={`Your time: ${formatCompact(at, getBrowserTimeZone())}`}>
            {formatCompact(at, c.scheduledTimeZone)}
            {c.scheduledCity ? ` · ${c.scheduledCity}, ${c.scheduledCountry}` : ""}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const client = row.original;
        const label = client.fullName || client.email || client._id;
        return (
          <div className="management-row-actions">
            <button
              type="button"
              onClick={() => openInfo(client)}
              title="Show scheduled onboarding details"
              data-log-title={`Details Scheduled button clicked: ${label}`}
              className="management-row-action is-info"
            >
              <Icon name="calendar" size={16} />
              Details
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(client)}
              title="Delete client"
              data-log-title={`Delete Scheduled button clicked: ${label}`}
              className="management-row-action is-danger"
            >
              <Icon name="trash" size={16} />
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
        title="Scheduled Onboarding"
        description="This is where you will see your scheduled onboardings."
        data={clients}
        columns={columns}
        filterableFields={columns.filter((col) => col.accessorKey).map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
        disableRowModal
      />

      <ScheduledDetailsModal
        client={infoClient}
        onClose={() => setInfoClient(null)}
        onScheduleChanged={handleScheduleChanged}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        itemLabel={deleteTarget ? `client "${deleteTarget.fullName || ""}"` : "this client"}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await performDelete(deleteTarget);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
