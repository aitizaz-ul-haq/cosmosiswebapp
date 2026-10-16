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
} from "./clientStatusShared";
import {
  ModalButton,
  ModalGrid,
  ModalInput,
  ModalPasswordInput,
  ModalSelect,
  ModalShell,
  ModalTextarea,
} from "./modalkit/ModalKit";
import { logUIAction } from "@/lib/logUIAction";
import ScheduleOnboardingModal from "./scheduling/ScheduleOnboardingModal";

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
              className="dash-action-btn dash-btn-green-soft"
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
        <ModalShell
          icon="userPlus"
          title={`Register ${choiceTarget.fullName}`}
          subtitle="Choose how the client should be onboarded."
          size="md"
          onClose={() => setChoiceTarget(null)}
          closeLogTitle={`Closed Register choice: ${choiceTarget.fullName}`}
          footer={
            <>
              <ModalButton variant="neutral" onClick={() => setChoiceTarget(null)}>
                Cancel
              </ModalButton>
              <ModalButton
                variant="violet"
                icon="calendar"
                onClick={() => openSchedule(choiceTarget)}
                data-log-title={`Schedule Onboarding clicked: ${choiceTarget.fullName}`}
              >
                Schedule onboarding
              </ModalButton>
              <ModalButton
                variant="primary"
                icon="send"
                onClick={() => openRegister(choiceTarget)}
                data-log-title={`Register Now clicked: ${choiceTarget.fullName}`}
              >
                Register now
              </ModalButton>
            </>
          }
        >
          <p className="mk-note">
            <strong>Register now:</strong> the credentials are created and sent to the client in an
            email right away.
          </p>
          <p className="mk-note">
            <strong>Schedule onboarding:</strong> you create the credentials now and they are
            emailed to the client on the date and time you choose.
          </p>
        </ModalShell>
      )}

      {scheduleTarget && (
        <ScheduleOnboardingModal
          client={scheduleTarget}
          onClose={() => setScheduleTarget(null)}
          onScheduled={handleScheduled}
        />
      )}

      {registerTarget && (
        <ModalShell
          as="form"
          wrapperProps={{ onSubmit: handleRegisterSubmit }}
          icon="userPlus"
          title={`Register ${registerTarget.fullName}`}
          subtitle={`Credentials will be emailed to ${registerTarget.email}.`}
          size="md"
          dismissOnOverlay={false}
          onClose={() => setRegisterTarget(null)}
          closeLogTitle={`Closed Register form: ${registerTarget.fullName}`}
          footer={
            <>
              <ModalButton
                variant="danger"
                onClick={() => setRegisterTarget(null)}
                data-log-title={`Cancel Register clicked: ${registerTarget.fullName}`}
              >
                Cancel
              </ModalButton>
              <ModalButton
                type="submit"
                variant="primary"
                icon="send"
                disabled={submitting}
                data-log-title={`Register and send email clicked: ${registerTarget.fullName}`}
              >
                {submitting ? "Registering..." : "Register and send email"}
              </ModalButton>
            </>
          }
        >
          <ModalGrid>
            <ModalInput
              label="Username"
              required
              icon="user"
              placeholder="Username"
              value={registerForm.username}
              onChange={(e) => setRegisterForm((p) => ({ ...p, username: e.target.value }))}
              autoComplete="off"
            />
            <ModalPasswordInput
              label="Password"
              required
              hint="Minimum 8 characters."
              placeholder="Password (min 8 characters)"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
              autoComplete="new-password"
              minLength={8}
            />
          </ModalGrid>
        </ModalShell>
      )}

      {editTarget && (
        <ModalShell
          as="form"
          wrapperProps={{ onSubmit: handleEditSubmit }}
          icon="userEdit"
          title="Edit Client"
          subtitle="Update the client's details before registering."
          size="md"
          dismissOnOverlay={false}
          onClose={() => setEditTarget(null)}
          closeLogTitle={`Closed Edit Registry form: ${editTarget.fullName}`}
          footer={
            <>
              <ModalButton
                variant="danger"
                onClick={() => setEditTarget(null)}
                data-log-title={`Cancel Edit Registry clicked: ${editTarget.fullName}`}
              >
                Cancel
              </ModalButton>
              <ModalButton
                type="submit"
                variant="primary"
                icon="save"
                disabled={submitting}
                data-log-title={`Save Registry changes clicked: ${editTarget.fullName}`}
              >
                Save Changes
              </ModalButton>
            </>
          }
        >
          <ModalGrid>
            <ModalInput
              label="Full Name"
              required
              icon="user"
              placeholder="Full Name"
              value={editForm.fullName}
              onChange={setEditField("fullName")}
            />
            <ModalInput
              label="Email"
              required
              icon="mail"
              type="email"
              placeholder="Email"
              value={editForm.email}
              onChange={setEditField("email")}
            />
            <ModalInput
              label="Phone"
              required
              icon="phone"
              placeholder="Phone"
              value={editForm.phone}
              onChange={setEditField("phone")}
            />
            <ModalSelect
              label="Onboarding Type"
              icon="briefcase"
              value={editForm.onboardingType}
              onChange={setEditField("onboardingType")}
            >
              {ONBOARDING_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </ModalSelect>
          </ModalGrid>
          <ModalTextarea
            label="RM Remarks"
            icon="file"
            placeholder="Notes about this client"
            value={editForm.rmRemarks}
            onChange={setEditField("rmRemarks")}
          />
        </ModalShell>
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
