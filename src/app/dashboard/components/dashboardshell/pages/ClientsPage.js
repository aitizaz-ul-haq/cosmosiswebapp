"use client";

import { useEffect, useId, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ScheduledDetailsModal from "./ScheduledDetailsModal";
import {
  DetailList,
  DetailRow,
  Icon,
  ModalButton,
  ModalField,
  ModalGrid,
  ModalSection,
  ModalShell,
  ModalTextarea,
  STATUS_TONES,
  StatusPill,
  initialsOf,
} from "./modalkit/ModalKit";
import { STATUS_COLORS } from "./clientStatusShared";
import { logUIAction } from "@/lib/logUIAction";

// Form controls that keep the native `required` attribute on the input itself.
function FormInput({ label, icon, hint, id, required, ...inputProps }) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <ModalField label={label} required={required} icon={icon} hint={hint} htmlFor={inputId}>
      <input id={inputId} required={required} {...inputProps} />
    </ModalField>
  );
}

function FormSelect({ label, icon, hint, id, required, children, ...selectProps }) {
  const autoId = useId();
  const selectId = id || autoId;
  return (
    <ModalField label={label} required={required} icon={icon} hint={hint} htmlFor={selectId}>
      <select id={selectId} required={required} {...selectProps}>
        {children}
      </select>
      <Icon name="chevronDown" size={18} className="mk-control-trail" />
    </ModalField>
  );
}

function FormPassword({ label, hint, id, required, ...inputProps }) {
  const autoId = useId();
  const inputId = id || autoId;
  const [shown, setShown] = useState(false);
  return (
    <ModalField label={label} required={required} icon="lock" hint={hint} htmlFor={inputId}>
      <input id={inputId} required={required} type={shown ? "text" : "password"} {...inputProps} />
      <button
        type="button"
        className="mk-control-btn"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
      >
        <Icon name={shown ? "eyeOff" : "eye"} size={18} />
      </button>
    </ModalField>
  );
}

// "Shared client" checkbox with the list of other RMs to share with.
function SharePanel({ form, rmUsers, onSharedChange, onToggleRm }) {
  const others = rmUsers.filter((rm) => String(rm._id) !== String(form.assignedToUserId));
  return (
    <div className="mk-panel mk-span-all">
      <label className="mk-check" style={{ fontWeight: 600 }}>
        <input
          type="checkbox"
          checked={form.isShared}
          onChange={(e) => onSharedChange(e.target.checked)}
        />
        Shared client (assign to additional RMs)
      </label>
      {form.isShared && (
        <div className="mk-check-list">
          {others.length === 0 ? (
            <span className="mk-hint">No other RMs available to share with.</span>
          ) : (
            others.map((rm) => (
              <label key={rm._id} className="mk-check">
                <input
                  type="checkbox"
                  checked={form.sharedWithUserIds.some((id) => String(id) === String(rm._id))}
                  onChange={() => onToggleRm(rm._id)}
                />
                {rm.fullName || rm.username}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ClientsPage() {
  const { user } = useUser();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editProfileId, setEditProfileId] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoClient, setInfoClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [originalAssignedToUserId, setOriginalAssignedToUserId] = useState(null);
  const [rmUsers, setRmUsers] = useState([]);
  const [addForm, setAddForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "client",
    companyId: "",
    assignedToUserId: "",
    status: "ongoing",
    onboardingType: "individual",
    rmRemarks: "",
    isShared: false,
    sharedWithUserIds: [],
  });
  const [editForm, setEditForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    role: "client",
    companyId: "",
    password: "",
    assignedToUserId: "",
    status: "ongoing",
    onboardingType: "individual",
    isShared: false,
    sharedWithUserIds: [],
  });

  const handleDelete = (client) => {
    const profileId = client?.profileId || null;
    const userId = client?.userId || client?._id || null;
    const deleteId = profileId || userId;
    if (!deleteId) return;
    // Open the password-verified delete confirmation modal
    setDeleteTarget(client);
  };

  const performDelete = async (client) => {
    const profileId = client?.profileId || null;
    const userId = client?.userId || client?._id || null;
    const deleteId = profileId || userId;
    if (!deleteId) return;
    const res = await fetch(`/api/clients?id=${encodeURIComponent(deleteId)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      window.alert(result?.error || "Failed to delete client");
      return;
    }
    setClients((prev) =>
      prev.filter((u) => {
        const existingUserId = u.userId || u._id;
        return String(existingUserId) !== String(userId);
      })
    );
    // 🔒 Audit log: client deleted (store the removed entry)
    logUIAction("record_deleted", {
      title: `Deleted client: ${client?.fullName || client?.username || userId}`,
      entityType: "client",
      entity: {
        id: userId,
        username: client?.username || null,
        fullName: client?.fullName || null,
        email: client?.email || null,
        companyName: client?.companyName || null,
      },
    });
  };

  const handleEmail = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const openInfoModal = (client) => {
    if (!client) return;
    setInfoClient(client);
    setShowInfoModal(true);
    // 🔒 Audit log: client info viewed
    logUIAction("view_client_info", {
      title: `Viewed client info: ${client?.fullName || client?.username || client?._id}`,
      entityType: "client",
      entity: {
        id: client?._id || client?.userId || null,
        username: client?.username || null,
        fullName: client?.fullName || null,
        email: client?.email || null,
        companyName: client?.companyName || null,
      },
    });
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setInfoClient(null);
  };

  const canAssignRm = user?.role === "supervisor" || user?.role === "superadmin";
  const isRm = user?.role === "rm";

  // Shared layout style for table action buttons (colors come from CSS classes)
  const actionBtnStyle = {
    padding: "0.4rem 0.75rem",
    textAlign: "center",
    fontWeight: 700,
    borderRadius: "0.5rem",
  };

  const STATUS_OPTIONS = [
    { value: "ongoing", label: "In progress" },
    { value: "on_hold", label: "On hold" },
    { value: "cancelled", label: "Cancelled" },
  ];
  // Workflow statuses are set by the approval flow, so they are not selectable
  const STATUS_LABEL_OPTIONS = [
    { value: "approval_pending", label: "Approval pending" },
    { value: "under_review", label: "Under review" },
    { value: "register", label: "Awaiting registry" },
    { value: "scheduled", label: "Scheduled" },
    ...STATUS_OPTIONS,
  ];
  const isWorkflowStatus = (value) =>
    value === "approval_pending" ||
    value === "under_review" ||
    value === "register" ||
    value === "scheduled";
  const ONBOARDING_TYPE_OPTIONS = [
    { value: "individual", label: "Individual" },
    { value: "joint", label: "Joint" },
    { value: "corporate", label: "Corporate" },
    { value: "trust", label: "Trust" },
  ];
  const labelFor = (options, value) =>
    options.find((o) => o.value === value)?.label || value || "—";

  // Human-readable descriptions for status hover tooltips
  const STATUS_DESCRIPTIONS = {
    approval_pending: "Waiting for supervisor approval",
    under_review: "Being reviewed by the supervisor",
    register: "Approved - ready to be registered by the RM",
    scheduled: "Credentials will be sent to the client at the scheduled time",
    ongoing: "Current onboarding status is In progress",
    on_hold: "Current onboarding status is On hold",
    cancelled: "Current onboarding status is Cancelled",
  };

  // 6 phases mapped to the individual onboarding form's 6 sections.
  // Progress is shown as a percentage in a neutral, light-bordered oval.
  const PHASE_CONFIG = [
    { phase: 1, pct: 20, name: "Personal Details" },
    { phase: 2, pct: 35, name: "Source of Wealth" },
    { phase: 3, pct: 50, name: "Financial Profile" },
    { phase: 4, pct: 65, name: "Risk Profile" },
    { phase: 5, pct: 80, name: "Signature" },
    { phase: 6, pct: 100, name: "Documentation Checklist" },
  ];

  // Resolve the phase config for a client (individual onboarding only)
  const getPhaseConfig = (client) => {
    const step = Number(client?.onboarding?.currentStep) || 1;
    const clamped = Math.min(Math.max(step, 1), 6);
    return PHASE_CONFIG[clamped - 1];
  };

  // Status badge: colored pill (ongoing/on_hold/cancelled) with hover description
  const StatusBadge = ({ client }) => {
    const value = client?.status || "ongoing";
    const c = STATUS_COLORS[value] || STATUS_COLORS.ongoing;
    return (
      <span
        title={STATUS_DESCRIPTIONS[value] || STATUS_DESCRIPTIONS.ongoing}
        style={{
          display: "inline-block",
          textAlign: "center",
          padding: "0.2rem 0.7rem",
          borderRadius: "999px",
          fontWeight: 600,
          fontSize: "0.8rem",
          lineHeight: 1.3,
          backgroundColor: c.bg,
          color: c.text,
          border: `1px solid ${c.border}`,
          cursor: "help",
        }}
      >
        {labelFor(STATUS_LABEL_OPTIONS, value)}
      </span>
    );
  };

  // Progress oval: neutral, light-bordered pill showing percentage + phase
  const ProgressOval = ({ client }) => {
    // Progress oval only applies to individual onboarding type
    if ((client?.onboardingType || "individual") !== "individual") {
      return <span>—</span>;
    }
    const cfg = getPhaseConfig(client);
    return (
      <span
        title={`Progress is ${cfg.pct}% — the client is at Phase ${cfg.phase} of 6: ${cfg.name}`}
        style={{
          display: "inline-block",
          textAlign: "center",
          padding: "0.25rem 0.75rem",
          borderRadius: "999px",
          fontWeight: 600,
          fontSize: "0.82rem",
          lineHeight: 1.3,
          backgroundColor: "#ECEFF7",
          color: "#6D7692",
          border: "1px solid #ECEFF7",
          whiteSpace: "nowrap",
        }}
      >
        {cfg.pct}% · Phase {cfg.phase}
      </span>
    );
  };

  useEffect(() => {
    let isMounted = true;
    const loadClients = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/clients", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch clients");
        }
        if (isMounted) {
          setClients(data.clients || []);
        }
      } catch (err) {
        if (isMounted) {
          setClients([]);
          setError(err?.message || "Failed to fetch clients");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    if (user) {
      loadClients();
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user?.companyId, user]);

  useEffect(() => {
    if ((!showAddModal && !showEditModal) || !canAssignRm || !user?.companyId) {
      setRmUsers([]);
      return;
    }
    fetch("/api/users", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const users = Array.isArray(data.users) ? data.users : [];
        const filtered = users.filter(
          (rm) => rm.role === "rm" && rm.companyId === user.companyId
        );
        setRmUsers(filtered);
      })
      .catch(() => setRmUsers([]));
  }, [showAddModal, showEditModal, canAssignRm, user?.companyId, user?.role]);

  const handleAddChange = (key) => (e) => {
    const value = e?.target?.value ?? "";
    setAddForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditChange = (key) => (e) => {
    const value = e?.target?.value ?? "";
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle an RM in the shared list for the Add or Edit form
  const toggleSharedRm = (setForm) => (rmId) => {
    setForm((prev) => {
      const current = Array.isArray(prev.sharedWithUserIds) ? prev.sharedWithUserIds : [];
      const exists = current.some((id) => String(id) === String(rmId));
      const next = exists
        ? current.filter((id) => String(id) !== String(rmId))
        : [...current, rmId];
      return { ...prev, sharedWithUserIds: next };
    });
  };

  const openAddModal = () => {
    setAddForm({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "client",
      companyId: user?.companyId || "",
      assignedToUserId: "",
      status: "ongoing",
      onboardingType: "individual",
      rmRemarks: "",
      isShared: false,
      sharedWithUserIds: [],
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payload = isRm
      ? {
          fullName: addForm.fullName,
          email: addForm.email,
          phone: addForm.phone,
          rmRemarks: addForm.rmRemarks,
          onboardingType: addForm.onboardingType,
        }
      : {
          username: addForm.username,
          fullName: addForm.fullName,
          email: addForm.email,
          phone: addForm.phone,
          password: addForm.password,
          assignedToUserId: canAssignRm ? addForm.assignedToUserId : undefined,
          status: addForm.status,
          onboardingType: addForm.onboardingType,
          isShared: canAssignRm ? addForm.isShared : false,
          sharedWithUserIds:
            canAssignRm && addForm.isShared ? addForm.sharedWithUserIds : [],
        };
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(result?.error || "Failed to create client");
      return;
    }
    if (result?.client) {
      setClients((prev) => [result.client, ...prev]);
    }
    // 🔒 Audit log: client created (store the created entry, never the password)
    logUIAction("record_created", {
      title: `${isRm ? "Submitted client for approval" : "Created client"}: ${result?.client?.fullName || addForm.fullName}`,
      entityType: "client",
      entity: {
        id: result?.client?.userId || result?.client?._id || null,
        username: addForm.username,
        fullName: addForm.fullName,
        email: addForm.email,
        companyId: user?.companyId || null,
      },
    });
    setShowAddModal(false);
  };

  const openEditModal = (client) => {
    const userId = client?.userId || client?._id;
    if (!userId) return;
    setEditUserId(userId);
    setEditProfileId(client?.profileId || null);
    setOriginalAssignedToUserId(client?.assignedToUserId || "");
    setEditForm({
      username: client.username || "",
      fullName: client.fullName || "",
      email: client.email || "",
      phone: client.phone || "",
      role: "client",
      companyId: client.companyId || "",
      password: "",
      assignedToUserId: client?.assignedToUserId || "",
      status: client?.status || "ongoing",
      onboardingType: client?.onboardingType || "individual",
      isShared: Boolean(client?.isShared),
      sharedWithUserIds: Array.isArray(client?.sharedWithUserIds)
        ? client.sharedWithUserIds.map(String)
        : [],
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditUserId(null);
    setEditProfileId(null);
    setOriginalAssignedToUserId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUserId) return;
    const res = await fetch(`/api/users?id=${encodeURIComponent(editUserId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(editForm),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(result?.error || "Failed to update client");
      return;
    }
    if (result?.user?._id) {
      setClients((prev) =>
        prev.map((client) => {
          const clientUserId = client.userId || client._id;
          if (String(clientUserId) !== String(result.user._id)) return client;
          return {
            ...client,
            _id: result.user._id,
            userId: result.user._id,
            username: result.user.username || client.username,
            fullName: result.user.fullName || result.user.username || "",
            email: result.user.email || "",
            phone: result.user.phone || "",
            companyId: result.user.companyId || client.companyId,
            companyName: result.user.companyName || client.companyName,
          };
        })
      );
    }

    if (canAssignRm && editProfileId) {
      const patchBody = {
        status: editForm.status,
        onboardingType: editForm.onboardingType,
        sharedWithUserIds: editForm.isShared ? editForm.sharedWithUserIds : [],
      };
      if (
        editForm.assignedToUserId &&
        editForm.assignedToUserId !== originalAssignedToUserId
      ) {
        patchBody.assignedToUserId = editForm.assignedToUserId;
      }
      const assignRes = await fetch(
        `/api/clients?id=${encodeURIComponent(editProfileId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(patchBody),
        }
      );
      const assignResult = await assignRes.json().catch(() => ({}));
      if (!assignRes.ok) {
        window.alert(assignResult?.error || "Failed to update client details");
        return;
      }
      if (assignResult?.client) {
        setClients((prev) =>
          prev.map((client) => {
            const clientUserId = client.userId || client._id;
            if (String(clientUserId) !== String(assignResult.client.userId)) return client;
            return { ...client, ...assignResult.client };
          })
        );
      }
    }
    setShowEditModal(false);
    setEditUserId(null);
    setEditProfileId(null);
    setOriginalAssignedToUserId(null);
    // 🔒 Audit log: client edited (store the updated entry)
    logUIAction("record_updated", {
      title: `Edited client: ${result?.user?.fullName || editForm.fullName}`,
      entityType: "client",
      entity: {
        id: editUserId,
        username: editForm.username,
        fullName: editForm.fullName,
        email: editForm.email,
        companyId: editForm.companyId || null,
        assignedToUserId: editForm.assignedToUserId || null,
      },
    });
  };

  const tableTitle = "Clients";
  const tableDescription =
    user?.role === "rm"
      ? "All your registered clients are displayed here."
      : "This is where you can see all your registered clients";

  const columns = [
    { accessorKey: "fullName", header: "Name" },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "status",
      header: "Status",
      accessorFn: (row) => labelFor(STATUS_LABEL_OPTIONS, row.status),
      cell: ({ row }) => <StatusBadge client={row.original} />,
    },
    {
      id: "progress",
      header: "Progress",
      accessorFn: (row) =>
        (row.onboardingType || "individual") === "individual"
          ? `${getPhaseConfig(row).pct}%`
          : "—",
      cell: ({ row }) => <ProgressOval client={row.original} />,
    },
    {
      id: "onboardingType",
      header: "Onboarding Type",
      accessorFn: (row) => labelFor(ONBOARDING_TYPE_OPTIONS, row.onboardingType),
      cell: ({ row }) => labelFor(ONBOARDING_TYPE_OPTIONS, row.original.onboardingType),
    },
    ...(canAssignRm
      ? [
          { accessorKey: "assignedToName", header: "Assigned To" },
          {
            id: "sharedWith",
            header: "Shared With",
            accessorFn: (row) =>
              row.isShared && Array.isArray(row.sharedWithNames)
                ? row.sharedWithNames.join(", ")
                : "",
            cell: ({ row }) =>
              row.original.isShared &&
              Array.isArray(row.original.sharedWithNames) &&
              row.original.sharedWithNames.length > 0
                ? row.original.sharedWithNames.join(", ")
                : "—",
          },
        ]
      : []),
    { accessorKey: "assignedByName", header: "Assigned By" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => handleEmail(row?.original?.email)}
            title="Send email now"
            data-log-title={`Email Client button clicked: ${row?.original?.fullName || row?.original?.email || row?.original?._id}`}
            className="dash-action-btn dash-btn-neutral"
            style={actionBtnStyle}
          >
            Email
          </button>
          {!isWorkflowStatus(row?.original?.status) && (
            <button
              type="button"
              onClick={() => openEditModal(row?.original)}
              title="Edit client details"
              data-log-title={`Edit Client button clicked: ${row?.original?.fullName || row?.original?.username || row?.original?._id}`}
              className="dash-action-btn dash-btn-green-soft"
              style={actionBtnStyle}
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => openInfoModal(row?.original)}
            title="Show client info"
            data-log-title={`Info Client button clicked: ${row?.original?.fullName || row?.original?.username || row?.original?._id}`}
            className="dash-action-btn dash-btn-info"
            style={actionBtnStyle}
          >
            Info
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row?.original)}
            title="Delete client"
            data-log-title={`Delete Client button clicked: ${row?.original?.fullName || row?.original?.username || row?.original?._id}`}
            className="dash-action-btn dash-btn-danger"
            style={actionBtnStyle}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const infoStatusKey = infoClient?.status || "ongoing";
  const infoName = infoClient?.fullName || infoClient?.username || "Client details";
  const infoIsIndividual = (infoClient?.onboardingType || "individual") === "individual";
  const infoPhase = infoClient && infoIsIndividual ? getPhaseConfig(infoClient) : null;
  const infoStatusPill = (
    <StatusPill tone={STATUS_TONES[infoStatusKey] || "slate"}>
      {labelFor(STATUS_LABEL_OPTIONS, infoClient?.status)}
    </StatusPill>
  );

  return (
    <div>
      {!user?.companyId && !loading && (
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
          No company assigned to your account. Please contact administrator.
        </div>
      )}
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
        title={tableTitle}
        description={tableDescription}
        data={clients}
        columns={columns}
        filterableFields={columns.filter((col) => col.accessorKey).map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
        disableRowModal
        onAddClient={openAddModal}
      />

      {showAddModal && (
        <ModalShell
          as="form"
          wrapperProps={{ onSubmit: handleAddSubmit }}
          icon="userPlus"
          title="Add Client"
          subtitle={
            isRm
              ? "Enter the client's basic information to submit for approval."
              : "Enter the client's information to create a new client record."
          }
          onClose={closeAddModal}
          closeLogTitle="Closed Add Client form"
          size="lg"
          dismissOnOverlay={false}
          footer={
            <>
              <ModalButton variant="danger" onClick={closeAddModal}>
                Cancel
              </ModalButton>
              <ModalButton variant="primary" icon="save" type="submit">
                Save
              </ModalButton>
            </>
          }
        >
          <ModalGrid>
            {!isRm && (
              <FormInput
                label="Username"
                icon="user"
                placeholder="Enter username"
                value={addForm.username}
                onChange={handleAddChange("username")}
                required
              />
            )}
            <FormInput
              label="Full Name"
              icon="user"
              placeholder="Enter full name"
              hint="Use the client's legal name as per official documents."
              value={addForm.fullName}
              onChange={handleAddChange("fullName")}
              required
            />
            <FormInput
              label="Email"
              icon="mail"
              type="email"
              placeholder="Enter email address"
              hint="We'll use this email for notifications and account access."
              value={addForm.email}
              onChange={handleAddChange("email")}
              required
            />
            <FormInput
              label="Phone"
              icon="phone"
              placeholder="Enter phone number"
              hint="Include country code if applicable."
              value={addForm.phone}
              onChange={handleAddChange("phone")}
              required
            />
            {!isRm && (
              <FormSelect
                label="Status"
                icon="clock"
                value={addForm.status}
                onChange={handleAddChange("status")}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </FormSelect>
            )}
            <FormSelect
              label="Onboarding Type"
              icon="users"
              hint="Select the onboarding type for this client."
              value={addForm.onboardingType}
              onChange={handleAddChange("onboardingType")}
            >
              {ONBOARDING_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FormSelect>
            {canAssignRm && (
              <FormSelect
                label="Assign RM"
                icon="briefcase"
                value={addForm.assignedToUserId}
                onChange={handleAddChange("assignedToUserId")}
                required
              >
                <option value="">Select RM</option>
                {rmUsers.map((rm) => (
                  <option key={rm._id} value={rm._id}>
                    {rm.fullName || rm.username}
                  </option>
                ))}
              </FormSelect>
            )}
            {!isRm && (
              <FormPassword
                label="Password"
                placeholder="Enter password"
                value={addForm.password}
                onChange={handleAddChange("password")}
                required
              />
            )}
            {canAssignRm && (
              <SharePanel
                form={addForm}
                rmUsers={rmUsers}
                onSharedChange={(checked) =>
                  setAddForm((prev) => ({ ...prev, isShared: checked }))
                }
                onToggleRm={toggleSharedRm(setAddForm)}
              />
            )}
          </ModalGrid>
          {isRm && (
            <ModalTextarea
              label="RM Remarks"
              icon="file"
              placeholder="Add any relevant remarks about this client..."
              hint="Include any important background information, notes, or context."
              maxLength={1000}
              value={addForm.rmRemarks}
              onChange={handleAddChange("rmRemarks")}
            />
          )}
        </ModalShell>
      )}

      {showEditModal && (
        <ModalShell
          as="form"
          wrapperProps={{ onSubmit: handleEditSubmit }}
          icon="userEdit"
          title="Edit Client"
          subtitle="Update the client's details and access."
          onClose={closeEditModal}
          closeLogTitle="Closed Edit Client form"
          size="lg"
          dismissOnOverlay={false}
          footer={
            <>
              <ModalButton variant="danger" onClick={closeEditModal}>
                Cancel
              </ModalButton>
              <ModalButton variant="primary" icon="save" type="submit">
                Save Changes
              </ModalButton>
            </>
          }
        >
          <ModalGrid>
            <FormInput
              label="Username"
              icon="user"
              placeholder="Enter username"
              value={editForm.username}
              onChange={handleEditChange("username")}
              required
            />
            <FormInput
              label="Full Name"
              icon="user"
              placeholder="Enter full name"
              value={editForm.fullName}
              onChange={handleEditChange("fullName")}
              required
            />
            <FormInput
              label="Email"
              icon="mail"
              type="email"
              placeholder="Enter email address"
              value={editForm.email}
              onChange={handleEditChange("email")}
              required
            />
            <FormInput
              label="Phone"
              icon="phone"
              placeholder="Enter phone number"
              value={editForm.phone}
              onChange={handleEditChange("phone")}
              required
            />
            {canAssignRm && (
              <FormSelect
                label="Status"
                icon="clock"
                value={editForm.status}
                onChange={handleEditChange("status")}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </FormSelect>
            )}
            {canAssignRm && (
              <FormSelect
                label="Onboarding Type"
                icon="users"
                value={editForm.onboardingType}
                onChange={handleEditChange("onboardingType")}
              >
                {ONBOARDING_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </FormSelect>
            )}
            {canAssignRm && (
              <FormSelect
                label="Assigned RM"
                icon="briefcase"
                value={editForm.assignedToUserId}
                onChange={handleEditChange("assignedToUserId")}
              >
                <option value="">Reassign RM (optional)</option>
                {rmUsers.map((rm) => (
                  <option key={rm._id} value={rm._id}>
                    {rm.fullName || rm.username}
                  </option>
                ))}
              </FormSelect>
            )}
            <FormPassword
              label="New Password"
              placeholder="Leave blank to keep current"
              value={editForm.password}
              onChange={handleEditChange("password")}
            />
            {canAssignRm && (
              <SharePanel
                form={editForm}
                rmUsers={rmUsers}
                onSharedChange={(checked) =>
                  setEditForm((prev) => ({ ...prev, isShared: checked }))
                }
                onToggleRm={toggleSharedRm(setEditForm)}
              />
            )}
          </ModalGrid>
        </ModalShell>
      )}

      {showInfoModal && infoClient && infoClient.status === "scheduled" && (
        <ScheduledDetailsModal
          client={infoClient}
          onClose={closeInfoModal}
          onScheduleChanged={(client, next) => {
            const key = String(client.profileId || client.userId || client._id);
            setClients((prev) =>
              prev.map((c) =>
                String(c.profileId || c.userId || c._id) === key ? { ...c, ...next } : c
              )
            );
            setInfoClient((prev) => (prev ? { ...prev, ...next } : prev));
          }}
        />
      )}

      {showInfoModal && infoClient && infoClient.status !== "scheduled" && (
        <ModalShell
          avatar={initialsOf(infoName)}
          title={infoName}
          badges={
            <>
              {infoClient.companyName ? (
                <StatusPill tone="slate" icon="building">
                  {infoClient.companyName}
                </StatusPill>
              ) : null}
              <StatusPill tone="slate" icon="user">
                {labelFor(ONBOARDING_TYPE_OPTIONS, infoClient.onboardingType)}
              </StatusPill>
            </>
          }
          onClose={closeInfoModal}
          closeLogTitle="Close Client Info modal"
          size="lg"
          footer={
            <>
              <ModalButton
                variant="info"
                icon="mail"
                onClick={() => handleEmail(infoClient?.email)}
                data-log-title={`Email Client button clicked (info modal): ${infoClient?.fullName || infoClient?.email}`}
              >
                Email
              </ModalButton>
              <ModalButton
                variant="neutral"
                icon="x"
                onClick={closeInfoModal}
                data-log-title="Close Client Info modal"
              >
                Close
              </ModalButton>
            </>
          }
        >
          <ModalGrid>
            <div className="mk-stack">
              <ModalSection
                icon="user"
                tone="violet"
                title="Client Information"
                description="Basic details and contact information."
              >
                <DetailList>
                  <DetailRow icon="user" label="Full name" value={infoClient?.fullName} />
                  <DetailRow icon="user" label="Username" value={infoClient?.username} />
                  <DetailRow icon="mail" label="Email" value={infoClient?.email} />
                  <DetailRow icon="phone" label="Phone" value={infoClient?.phone} />
                </DetailList>
              </ModalSection>

              <ModalSection
                icon="building"
                tone="green"
                title="Company"
                description="Associated company information."
              >
                <DetailList>
                  <DetailRow icon="building" label="Company" value={infoClient?.companyName} />
                </DetailList>
              </ModalSection>
            </div>

            <div className="mk-stack">
              <ModalSection
                icon="chart"
                tone="blue"
                title="Onboarding & Progress"
                description="Current onboarding status and progress details."
              >
                <DetailList>
                  <DetailRow icon="clock" label="Status" value={infoStatusPill} />
                  <DetailRow
                    icon="users"
                    label="Onboarding type"
                    value={labelFor(ONBOARDING_TYPE_OPTIONS, infoClient?.onboardingType)}
                  />
                  {infoPhase ? null : <DetailRow icon="chart" label="Progress" value="—" />}
                </DetailList>
                {infoPhase ? (
                  <div
                    className="mk-progress-box"
                    title={`Progress is ${infoPhase.pct}% — the client is at Phase ${infoPhase.phase} of 6: ${infoPhase.name}`}
                  >
                    <div className="mk-progress-row">
                      <Icon name="chart" size={17} className="mk-detail-icon" />
                      <span style={{ fontSize: "0.85rem", color: "#6d7692" }}>Progress</span>
                      <StatusPill tone="slate">{infoPhase.pct}%</StatusPill>
                      <div
                        className="mk-progress"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={infoPhase.pct}
                      >
                        <div className="mk-progress-bar" style={{ width: `${infoPhase.pct}%` }} />
                      </div>
                    </div>
                    <div>
                      <StatusPill tone="slate" icon="file">
                        Phase {infoPhase.phase} of 6 — {infoPhase.name}
                      </StatusPill>
                    </div>
                  </div>
                ) : null}
              </ModalSection>

              <ModalSection
                icon="users"
                tone="violet"
                title="Assignment & Access"
                description="Team members and access information."
              >
                <DetailList>
                  <DetailRow icon="user" label="Assigned to" value={infoClient?.assignedToName} />
                  <DetailRow icon="user" label="Assigned by" value={infoClient?.assignedByName} />
                  <DetailRow
                    icon="share"
                    label="Shared with"
                    value={
                      infoClient?.isShared &&
                      Array.isArray(infoClient?.sharedWithNames) &&
                      infoClient.sharedWithNames.length > 0
                        ? infoClient.sharedWithNames.join(", ")
                        : "—"
                    }
                  />
                </DetailList>
              </ModalSection>
            </div>
          </ModalGrid>

          <ModalSection
            icon="file"
            tone="blue"
            title="Additional Information"
            description="Notes and record details."
          >
            <DetailList>
              <DetailRow icon="file" label="RM remarks" value={infoClient?.rmRemarks} />
              <DetailRow
                icon="calendar"
                label="Created"
                value={
                  infoClient?.createdAt ? new Date(infoClient.createdAt).toLocaleString() : "—"
                }
              />
            </DetailList>
          </ModalSection>
        </ModalShell>
      )}

      <DeleteConfirmModal
        open={!!deleteTarget}
        itemLabel={
          deleteTarget
            ? `client "${deleteTarget.fullName || deleteTarget.username || ""}"`
            : "this client"
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
