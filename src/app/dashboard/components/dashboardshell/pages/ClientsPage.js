"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTable from "./GenericTable";
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
  });

  const handleDelete = async (client) => {
    const profileId = client?.profileId || null;
    const userId = client?.userId || client?._id || null;
    const deleteId = profileId || userId;
    if (!deleteId || !window.confirm("Delete this client?")) return;
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

  const canAssignRm = user?.role === "supervisor" || user?.role === "superadmin";

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

    if (
      canAssignRm &&
      editProfileId &&
      editForm.assignedToUserId &&
      editForm.assignedToUserId !== originalAssignedToUserId
    ) {
      const assignRes = await fetch(
        `/api/clients?id=${encodeURIComponent(editProfileId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            assignedToUserId: editForm.assignedToUserId,
          }),
        }
      );
      const assignResult = await assignRes.json().catch(() => ({}));
      if (!assignRes.ok) {
        window.alert(assignResult?.error || "Failed to update assigned RM");
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
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    ...(canAssignRm ? [{ accessorKey: "assignedToName", header: "Assigned To" }] : []),
    { accessorKey: "assignedByName", header: "Assigned By" },
    { accessorKey: "companyName", header: "Company" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => openEditModal(row?.original)}
            data-log-title={`Edit Client button clicked: ${row?.original?.fullName || row?.original?.username || row?.original?._id}`}
            style={{
              padding: "0.4rem 0.75rem",
              textAlign: "center",
              fontWeight: 700,
              borderRadius: "0.5rem",
              backgroundColor: "var(--sitegreen)",
              border: "1px solid var(--sitegreen)",
              color: "#fff",
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row?.original)}
            data-log-title={`Delete Client button clicked: ${row?.original?.fullName || row?.original?.username || row?.original?._id}`}
            style={{
              padding: "0.4rem 0.75rem",
              textAlign: "center",
              fontWeight: 700,
              borderRadius: "0.5rem",
              backgroundColor: "#dc2626",
              border: "1px solid #b91c1c",
              color: "#fff",
            }}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => handleEmail(row?.original?.email)}
            data-log-title={`Email Client button clicked: ${row?.original?.fullName || row?.original?.email || row?.original?._id}`}
            style={{
              padding: "0.4rem 0.75rem",
              textAlign: "center",
              fontWeight: 700,
              borderRadius: "0.5rem",
              backgroundColor: "#6D7692",
              border: "1px solid #6D7692",
              color: "#fff",
            }}
          >
            Email
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
              <input style={fieldStyle} type="password" placeholder="Password" value={addForm.password} onChange={handleAddChange("password")} required />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={closeAddModal}
                style={{ ...modalActionBtnStyle, backgroundColor: "#d32f2f" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--sitegreen)" }}
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
              <input style={fieldStyle} type="password" placeholder="New Password (leave blank to keep)" value={editForm.password} onChange={handleEditChange("password")} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={closeEditModal}
                style={{ ...modalActionBtnStyle, backgroundColor: "#d32f2f" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--sitegreen)" }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
