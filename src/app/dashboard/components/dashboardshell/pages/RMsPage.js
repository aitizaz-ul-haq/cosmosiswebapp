"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTable from "./GenericTable";

export default function RMsPage() {
  const { user } = useUser();
  const [rms, setRms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [addForm, setAddForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "rm",
    companyId: "",
  });
  const [editForm, setEditForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    role: "rm",
    companyId: "",
    password: "",
  });

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this RM?")) return;
    await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setRms((prev) => prev.filter((u) => u._id !== id));
  };

  useEffect(() => {
    let isMounted = true;
    const loadRMs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/users", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch RMs");
        }
        if (isMounted) {
          const filteredRMs = (data.users || []).filter(
            (u) => u.role === "rm" && u.companyId === user?.companyId
          );
          setRms(filteredRMs);
        }
      } catch (err) {
        if (isMounted) {
          setRms([]);
          setError(err?.message || "Failed to fetch RMs");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    if (user) {
      loadRMs();
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user?.companyId, user]);

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
      role: "rm",
      companyId: user?.companyId || "",
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...addForm,
      companyId: user?.companyId || null,
    };
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(result?.error || "Failed to create RM");
      return;
    }
    if (result?.user) {
      setRms((prev) => [result.user, ...prev]);
    }
    setShowAddModal(false);
  };

  const openEditModal = (rm) => {
    if (!rm?._id) return;
    setEditUserId(rm._id);
    setEditForm({
      username: rm.username || "",
      fullName: rm.fullName || "",
      email: rm.email || "",
      phone: rm.phone || "",
      role: rm.role || "rm",
      companyId: rm.companyId || "",
      password: "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditUserId(null);
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
      window.alert(result?.error || "Failed to update RM");
      return;
    }
    if (result?.user?._id) {
      setRms((prev) => {
        const updated = prev.map((u) => (u._id === result.user._id ? result.user : u));
        return updated.filter((u) => u.role === "rm" && u.companyId === user?.companyId);
      });
    }
    setShowEditModal(false);
    setEditUserId(null);
  };

  const tableTitle = "Relationship Managers";
  const tableDescription = "All your companies registered rms are listed here.";

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
    { accessorKey: "companyName", header: "Company" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => openEditModal(row?.original)}
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
            onClick={() => handleDelete(row?.original?._id)}
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
        data={rms}
        columns={columns}
        filterableFields={columns.filter((col) => col.accessorKey).map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
        disableRowModal
        onAddRM={openAddModal}
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
              <h3 style={{ margin: 0, textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Add RM</h3>
              <button type="button" onClick={closeAddModal} style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={fieldStyle} placeholder="Username" value={addForm.username} onChange={handleAddChange("username")} required />
              <input style={fieldStyle} placeholder="Full Name" value={addForm.fullName} onChange={handleAddChange("fullName")} required />
              <input style={fieldStyle} type="email" placeholder="Email" value={addForm.email} onChange={handleAddChange("email")} required />
              <input style={fieldStyle} placeholder="Phone" value={addForm.phone} onChange={handleAddChange("phone")} required />
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
              <h3 style={{ margin: 0, textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Edit RM</h3>
              <button type="button" onClick={closeEditModal} style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={fieldStyle} placeholder="Username" value={editForm.username} onChange={handleEditChange("username")} required />
              <input style={fieldStyle} placeholder="Full Name" value={editForm.fullName} onChange={handleEditChange("fullName")} required />
              <input style={fieldStyle} type="email" placeholder="Email" value={editForm.email} onChange={handleEditChange("email")} required />
              <input style={fieldStyle} placeholder="Phone" value={editForm.phone} onChange={handleEditChange("phone")} required />
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
