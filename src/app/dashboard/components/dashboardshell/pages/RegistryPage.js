"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ClientInfoModal from "./ClientInfoModal";
import {
  ClientStatusBadge,
  STATUS_LABELS,
  ONBOARDING_TYPE_OPTIONS,
  onboardingTypeLabel,
  actionBtnStyle,
  modalFieldStyle,
  modalActionBtnStyle,
  modalOverlayStyle,
} from "./clientStatusShared";
import { logUIAction } from "@/lib/logUIAction";
import ScheduleOnboardingModal from "./scheduling/ScheduleOnboardingModal";

const formCardStyle = {
  background: "#fff",
  width: "min(560px, 92vw)",
  maxHeight: "85vh",
  overflowY: "auto",
  borderRadius: "12px",
  padding: "1.25rem",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  textAlign: "left",
};

const labelStyle = { fontSize: "0.85rem", fontWeight: 600, color: "#374151" };

export default function RegistryPage() {
  const { user } = useUser();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoClient, setInfoClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [registerTarget, setRegisterTarget] = useState(null);
  const [choiceTarget, setChoiceTarget] = useState(null);
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [registerForm, setRegisterForm] = useState({ username: "", password: "" });
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    rmRemarks: "",
    onboardingType: "individual",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/clients?status=register", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to fetch registry");
        if (isMounted) setClients(data.clients || []);
      } catch (err) {
        if (isMounted) {
          setClients([]);
          setError(err?.message || "Failed to fetch registry");
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
      title: `Deleted registry client: ${client.fullName || client.email}`,
      entityType: "client",
      entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
    });
  };

  const openInfo = (client) => {
    setInfoClient(client);
    logUIAction("view_client_info", {
      title: `Viewed registry client info: ${client.fullName || client.email}`,
      entityType: "client",
      entity: { id: client.userId || null, fullName: client.fullName, email: client.email },
    });
  };

  const openRegister = (client) => {
    setChoiceTarget(null);
    setRegisterForm({ username: "", password: "" });
    setRegisterTarget(client);
  };

  const openSchedule = (client) => {
    setChoiceTarget(null);
    setScheduleTarget(client);
  };

  // Scheduled clients move to the Scheduled page
  const handleScheduled = () => {
    removeFromList(scheduleTarget);
    setScheduleTarget(null);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerTarget || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/clients/registry?id=${encodeURIComponent(getId(registerTarget))}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(registerForm),
        }
      );
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(result?.error || "Failed to register client");
        return;
      }
      removeFromList(registerTarget);
      if (result?.emailSent === false) {
        window.alert(
          "Client registered, but the email could not be sent. Please share the credentials manually."
        );
      }
      // The password is never logged.
      logUIAction("record_updated", {
        title: `Registered client: ${registerTarget.fullName || registerTarget.email}`,
        entityType: "client",
        entity: {
          id: registerTarget.userId || null,
          username: registerForm.username,
          fullName: registerTarget.fullName,
          email: registerTarget.email,
        },
      });
      setRegisterTarget(null);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (client) => {
    setEditForm({
      fullName: client.fullName || "",
      email: client.email || "",
      phone: client.phone || "",
      rmRemarks: client.rmRemarks || "",
      onboardingType: client.onboardingType || "individual",
    });
    setEditTarget(client);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTarget || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/clients/registry?id=${encodeURIComponent(getId(editTarget))}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editForm),
        }
      );
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(result?.error || "Failed to update client");
        return;
      }
      setClients((prev) =>
        prev.map((c) =>
          String(getId(c)) === String(getId(editTarget)) ? { ...c, ...editForm } : c
        )
      );
      logUIAction("record_updated", {
        title: `Edited registry client: ${editForm.fullName}`,
        entityType: "client",
        entity: {
          id: editTarget.userId || null,
          fullName: editForm.fullName,
          email: editForm.email,
        },
      });
      setEditTarget(null);
    } finally {
      setSubmitting(false);
    }
  };

  const setEditField = (key) => (e) =>
    setEditForm((prev) => ({ ...prev, [key]: e.target.value }));

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
              title="Show client info"
              data-log-title={`Info Registry button clicked: ${label}`}
              className="dash-action-btn dash-btn-info"
              style={actionBtnStyle}
            >
              Info
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(client)}
              title="Delete client"
              data-log-title={`Delete Registry button clicked: ${label}`}
              className="dash-action-btn dash-btn-danger"
              style={actionBtnStyle}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setChoiceTarget(client)}
              title="Register now or schedule the onboarding"
              data-log-title={`Register Client button clicked: ${label}`}
              className="dash-action-btn dash-btn-green"
              style={actionBtnStyle}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => openEdit(client)}
              title="Edit client details"
              data-log-title={`Edit Registry button clicked: ${label}`}
              className="dash-action-btn dash-btn-neutral"
              style={actionBtnStyle}
            >
              Edit
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
        title="Awaiting Registry"
        description="Clients approved by your supervisor and ready to be registered are displayed here."
        data={clients}
        columns={columns}
        filterableFields={columns.filter((col) => col.accessorKey).map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
        disableRowModal
      />

      <ClientInfoModal client={infoClient} onClose={() => setInfoClient(null)} />

      {choiceTarget && (
        <div style={modalOverlayStyle} onClick={() => setChoiceTarget(null)}>
          <div
            style={formCardStyle}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Register client"
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, width: "100%", textAlign: "center", fontSize: "1.2rem" }}>
                Register {choiceTarget.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setChoiceTarget(null)}
                aria-label="Close"
                data-log-title={`Closed Register choice: ${choiceTarget.fullName}`}
                style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: "0 0 0.6rem", fontSize: "0.95rem", color: "#374151" }}>
              Would you like to register the client right now? If you do, the credentials will be
              sent to the client right now in an email.
            </p>
            <p style={{ margin: "0 0 1rem", fontSize: "0.95rem", color: "#374151" }}>
              Or schedule the onboarding. You create the credentials now and they are emailed to
              the client on the date and time you choose.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => openRegister(choiceTarget)}
                data-log-title={`Register Now clicked: ${choiceTarget.fullName}`}
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--btn-green-light)" }}
              >
                Register now
              </button>
              <button
                type="button"
                onClick={() => openSchedule(choiceTarget)}
                data-log-title={`Schedule Onboarding clicked: ${choiceTarget.fullName}`}
                style={{ ...modalActionBtnStyle, backgroundColor: "#a78bfa" }}
              >
                Schedule onboarding
              </button>
            </div>
          </div>
        </div>
      )}

      {scheduleTarget && (
        <ScheduleOnboardingModal
          client={scheduleTarget}
          onClose={() => setScheduleTarget(null)}
          onScheduled={handleScheduled}
        />
      )}

      {registerTarget && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleRegisterSubmit} style={formCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, width: "100%", textAlign: "center", fontSize: "1.2rem" }}>
                Register {registerTarget.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setRegisterTarget(null)}
                aria-label="Close"
                data-log-title={`Closed Register form: ${registerTarget.fullName}`}
                style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", color: "#6D7692" }}>
              Credentials will be emailed to {registerTarget.email}.
            </p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input
                style={modalFieldStyle}
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) => setRegisterForm((p) => ({ ...p, username: e.target.value }))}
                autoComplete="off"
                required
              />
              <input
                style={modalFieldStyle}
                type="password"
                placeholder="Password (min 8 characters)"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setRegisterTarget(null)}
                data-log-title={`Cancel Register clicked: ${registerTarget.fullName}`}
                style={{ ...modalActionBtnStyle, backgroundColor: "#E57373" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                data-log-title={`Register and send email clicked: ${registerTarget.fullName}`}
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--btn-green-light)" }}
              >
                {submitting ? "Registering..." : "Register and send email"}
              </button>
            </div>
          </form>
        </div>
      )}

      {editTarget && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleEditSubmit} style={formCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, width: "100%", textAlign: "center", fontSize: "1.2rem" }}>
                Edit Client
              </h3>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                aria-label="Close"
                data-log-title={`Closed Edit Registry form: ${editTarget.fullName}`}
                style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={modalFieldStyle} placeholder="Full Name" value={editForm.fullName} onChange={setEditField("fullName")} required />
              <input style={modalFieldStyle} type="email" placeholder="Email" value={editForm.email} onChange={setEditField("email")} required />
              <input style={modalFieldStyle} placeholder="Phone" value={editForm.phone} onChange={setEditField("phone")} required />
              <label style={labelStyle}>
                Onboarding Type
                <select style={modalFieldStyle} value={editForm.onboardingType} onChange={setEditField("onboardingType")}>
                  {ONBOARDING_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label style={labelStyle}>
                RM Remarks
                <textarea style={{ ...modalFieldStyle, minHeight: "90px", resize: "vertical" }} value={editForm.rmRemarks} onChange={setEditField("rmRemarks")} />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                data-log-title={`Cancel Edit Registry clicked: ${editTarget.fullName}`}
                style={{ ...modalActionBtnStyle, backgroundColor: "#E57373" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                data-log-title={`Save Registry changes clicked: ${editTarget.fullName}`}
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--btn-green-light)" }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

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
