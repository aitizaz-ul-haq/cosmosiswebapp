"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { logUIAction } from "@/lib/logUIAction";

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

  // Shared layout style for table action buttons (colors come from CSS classes)
  const actionBtnStyle = {
    padding: "0.4rem 0.75rem",
    textAlign: "center",
    fontWeight: 700,
    borderRadius: "0.5rem",
  };

  const STATUS_OPTIONS = [
    { value: "ongoing", label: "Ongoing" },
    { value: "on_hold", label: "On hold" },
    { value: "cancelled", label: "Cancelled" },
  ];
  // Status colors: ongoing green, on_hold yellow, cancelled red
  const STATUS_COLORS = {
    ongoing: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
    on_hold: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
  };
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
    ongoing: "Current onboarding status is Ongoing",
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
        {labelFor(STATUS_OPTIONS, value)}
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
          backgroundColor: "transparent",
          color: "#21CFB2",
          border: "1px solid #21CFB2",
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
    const payload = {
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
      title: `Created client: ${result?.client?.fullName || addForm.fullName}`,
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

  const fieldStyle = {
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "6px",
  };

  const modalActionBtnStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "1rem",
    color: "#fff",
  };

  const columns = [
    { accessorKey: "fullName", header: "Name" },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "status",
      header: "Status",
      accessorFn: (row) => labelFor(STATUS_OPTIONS, row.status),
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
          <button
            type="button"
            onClick={() => openEditModal(row?.original)}
            title="Edit client details"
            data-log-title={`Edit Client button clicked: ${row?.original?.fullName || row?.original?.username || row?.original?._id}`}
            className="dash-action-btn dash-btn-green"
            style={actionBtnStyle}
          >
            Edit
          </button>
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleAddSubmit}
            style={{
              background: "#fff",
              width: "min(700px, 92vw)",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "1.25rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Add Client</h3>
              <button type="button" onClick={closeAddModal} data-log-title="Closed Add Client form" style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={fieldStyle} placeholder="Username" value={addForm.username} onChange={handleAddChange("username")} required />
              <input style={fieldStyle} placeholder="Full Name" value={addForm.fullName} onChange={handleAddChange("fullName")} required />
              <input style={fieldStyle} type="email" placeholder="Email" value={addForm.email} onChange={handleAddChange("email")} required />
              <input style={fieldStyle} placeholder="Phone" value={addForm.phone} onChange={handleAddChange("phone")} required />
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                Status
                <select style={fieldStyle} value={addForm.status} onChange={handleAddChange("status")}>
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                Onboarding Type
                <select style={fieldStyle} value={addForm.onboardingType} onChange={handleAddChange("onboardingType")}>
                  {ONBOARDING_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              {canAssignRm && (
                <select
                  style={fieldStyle}
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
                </select>
              )}
              {canAssignRm && (
                <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "0.75rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={addForm.isShared}
                      onChange={(e) => setAddForm((prev) => ({ ...prev, isShared: e.target.checked }))}
                    />
                    Shared client (assign to additional RMs)
                  </label>
                  {addForm.isShared && (
                    <div style={{ marginTop: "0.6rem", display: "grid", gap: "0.4rem", maxHeight: "160px", overflowY: "auto" }}>
                      {rmUsers.filter((rm) => String(rm._id) !== String(addForm.assignedToUserId)).length === 0 ? (
                        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>No other RMs available to share with.</span>
                      ) : (
                        rmUsers
                          .filter((rm) => String(rm._id) !== String(addForm.assignedToUserId))
                          .map((rm) => (
                            <label key={rm._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={addForm.sharedWithUserIds.some((id) => String(id) === String(rm._id))}
                                onChange={() => toggleSharedRm(setAddForm)(rm._id)}
                              />
                              {rm.fullName || rm.username}
                            </label>
                          ))
                      )}
                    </div>
                  )}
                </div>
              )}
              <input style={fieldStyle} type="password" placeholder="Password" value={addForm.password} onChange={handleAddChange("password")} required />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={closeAddModal}
                style={{ ...modalActionBtnStyle, backgroundColor: "#E57373" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--btn-green-light)" }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleEditSubmit}
            style={{
              background: "#fff",
              width: "min(700px, 92vw)",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "1.25rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Edit Client</h3>
              <button type="button" onClick={closeEditModal} data-log-title="Closed Edit Client form" style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={fieldStyle} placeholder="Username" value={editForm.username} onChange={handleEditChange("username")} required />
              <input style={fieldStyle} placeholder="Full Name" value={editForm.fullName} onChange={handleEditChange("fullName")} required />
              <input style={fieldStyle} type="email" placeholder="Email" value={editForm.email} onChange={handleEditChange("email")} required />
              <input style={fieldStyle} placeholder="Phone" value={editForm.phone} onChange={handleEditChange("phone")} required />
              {canAssignRm && (
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                  Status
                  <select style={fieldStyle} value={editForm.status} onChange={handleEditChange("status")}>
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              )}
              {canAssignRm && (
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                  Onboarding Type
                  <select style={fieldStyle} value={editForm.onboardingType} onChange={handleEditChange("onboardingType")}>
                    {ONBOARDING_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              )}
              {canAssignRm && (
                <select
                  style={fieldStyle}
                  value={editForm.assignedToUserId}
                  onChange={handleEditChange("assignedToUserId")}
                >
                  <option value="">Reassign RM (optional)</option>
                  {rmUsers.map((rm) => (
                    <option key={rm._id} value={rm._id}>
                      {rm.fullName || rm.username}
                    </option>
                  ))}
                </select>
              )}
              {canAssignRm && (
                <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "0.75rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={editForm.isShared}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, isShared: e.target.checked }))}
                    />
                    Shared client (assign to additional RMs)
                  </label>
                  {editForm.isShared && (
                    <div style={{ marginTop: "0.6rem", display: "grid", gap: "0.4rem", maxHeight: "160px", overflowY: "auto" }}>
                      {rmUsers.filter((rm) => String(rm._id) !== String(editForm.assignedToUserId)).length === 0 ? (
                        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>No other RMs available to share with.</span>
                      ) : (
                        rmUsers
                          .filter((rm) => String(rm._id) !== String(editForm.assignedToUserId))
                          .map((rm) => (
                            <label key={rm._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={editForm.sharedWithUserIds.some((id) => String(id) === String(rm._id))}
                                onChange={() => toggleSharedRm(setEditForm)(rm._id)}
                              />
                              {rm.fullName || rm.username}
                            </label>
                          ))
                      )}
                    </div>
                  )}
                </div>
              )}
              <input style={fieldStyle} type="password" placeholder="New Password (leave blank to keep)" value={editForm.password} onChange={handleEditChange("password")} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={closeEditModal}
                style={{ ...modalActionBtnStyle, backgroundColor: "#E57373" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--btn-green-light)" }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {showInfoModal && infoClient && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeInfoModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              width: "min(640px, 92vw)",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                {infoClient?.fullName || infoClient?.username || "Client details"}
              </h3>
              <button
                type="button"
                onClick={closeInfoModal}
                data-log-title="Close Client Info modal"
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.5rem",
                  lineHeight: 1,
                  cursor: "pointer",
                  color: "#6D7692",
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.35rem" }}>
              {[
                { label: "Full name", value: infoClient?.fullName },
                { label: "Username", value: infoClient?.username },
                { label: "Email", value: infoClient?.email },
                { label: "Phone", value: infoClient?.phone },
                { label: "Company", value: infoClient?.companyName },
                {
                  label: "Status",
                  value: labelFor(STATUS_OPTIONS, infoClient?.status),
                },
                {
                  label: "Onboarding type",
                  value: labelFor(ONBOARDING_TYPE_OPTIONS, infoClient?.onboardingType),
                },
                {
                  label: "Progress",
                  value:
                    (infoClient?.onboardingType || "individual") === "individual"
                      ? `${getPhaseConfig(infoClient).pct}% · Phase ${getPhaseConfig(infoClient).phase} of 6 — ${getPhaseConfig(infoClient).name}`
                      : "—",
                },
                { label: "Assigned to", value: infoClient?.assignedToName },
                { label: "Assigned by", value: infoClient?.assignedByName },
                {
                  label: "Shared with",
                  value:
                    infoClient?.isShared &&
                    Array.isArray(infoClient?.sharedWithNames) &&
                    infoClient.sharedWithNames.length > 0
                      ? infoClient.sharedWithNames.join(", ")
                      : "—",
                },
                {
                  label: "Created",
                  value: infoClient?.createdAt
                    ? new Date(infoClient.createdAt).toLocaleString()
                    : "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    gap: "0.5rem",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#6D7692" }}>
                    {item.label}
                  </span>
                  <span style={{ color: "#1a1a1a", wordBreak: "break-word" }}>
                    {item.value || "—"}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                marginTop: "1.25rem",
              }}
            >
              <button
                type="button"
                onClick={() => handleEmail(infoClient?.email)}
                data-log-title={`Email Client button clicked (info modal): ${infoClient?.fullName || infoClient?.email}`}
                style={{
                  padding: "0.5rem 1rem",
                  fontWeight: 700,
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--btn-neutral-light)",
                  border: "1px solid var(--btn-neutral-light)",
                  color: "#fff",
                }}
              >
                Email
              </button>
              <button
                type="button"
                onClick={closeInfoModal}
                data-log-title="Close Client Info modal"
                style={{
                  padding: "0.5rem 1rem",
                  fontWeight: 700,
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--btn-green-light)",
                  border: "1px solid var(--btn-green-light)",
                  color: "#fff",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
