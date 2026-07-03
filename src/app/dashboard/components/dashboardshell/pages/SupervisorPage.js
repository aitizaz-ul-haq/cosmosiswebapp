"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import { logUIAction } from "@/lib/logUIAction";

export default function SupervisorsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [editForm, setEditForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    role: "supervisor",
    companyId: "",
    password: "",
  });

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this user?")) return;
    const target = users.find((u) => u._id === id) || null;
    await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u._id !== id));
    // 🔒 Audit log: supervisor deleted (store the removed entry)
    logUIAction("record_deleted", {
      title: `Deleted supervisor: ${target?.fullName || target?.username || id}`,
      entityType: "supervisor",
      entity: {
        id,
        username: target?.username || null,
        fullName: target?.fullName || null,
        email: target?.email || null,
        companyName: target?.companyName || null,
      },
    });
  };

  const handleEmail = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/users", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch users");
        }
        if (isMounted) {
          const supervisors = (data.users || []).filter((user) => user.role === "supervisor");
          setUsers(supervisors);
        }
      } catch (err) {
        if (isMounted) {
          setUsers([]);
          setError(err?.message || "Failed to fetch users");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showEditModal) return;
    fetch("/api/companies", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCompanies(Array.isArray(data.companies) ? data.companies : []))
      .catch(() => setCompanies([]));
  }, [showEditModal]);

  const handleEditChange = (key) => (e) => {
    const value = e?.target?.value ?? "";
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const openEditModal = (user) => {
    if (!user?._id) return;
    setEditUserId(user._id);
    setEditForm({
      username: user.username || "",
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "supervisor",
      companyId: user.companyId || "",
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
      window.alert(result?.error || "Failed to update user");
      return;
    }
    if (result?.user?._id) {
      setUsers((prev) => {
        const next = prev.map((u) => (u._id === result.user._id ? result.user : u));
        return next.filter((u) => u.role === "supervisor");
      });
    }
    setShowEditModal(false);
    setEditUserId(null);
    // 🔒 Audit log: supervisor edited (store the updated entry)
    logUIAction("record_updated", {
      title: `Edited supervisor: ${result?.user?.fullName || editForm.fullName}`,
      entityType: "supervisor",
      entity: {
        id: editUserId,
        username: editForm.username,
        fullName: editForm.fullName,
        email: editForm.email,
        companyId: editForm.companyId || null,
      },
    });
  };

  const tableTitle = "Supervisors";
  const tableDescription = "All supervisors information is displayed here.";

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
    { accessorKey: "companyName", header: "Company" },
    { accessorKey: "role", header: "Role" },
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
          <button
            type="button"
            onClick={() => handleEmail(row?.original?.email)}
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
        data={users}
        columns={columns}
        filterableFields={columns.map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
        disableRowModal
      />

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
              <h3 style={{ margin: 0, textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Edit Supervisor</h3>
              <button type="button" onClick={closeEditModal} data-log-title="Closed Edit Supervisor form" style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={fieldStyle} placeholder="Username" value={editForm.username} onChange={handleEditChange("username")} required />
              <input style={fieldStyle} placeholder="Full Name" value={editForm.fullName} onChange={handleEditChange("fullName")} required />
              <input style={fieldStyle} type="email" placeholder="Email" value={editForm.email} onChange={handleEditChange("email")} required />
              <input style={fieldStyle} placeholder="Phone" value={editForm.phone} onChange={handleEditChange("phone")} required />
              <input style={fieldStyle} type="password" placeholder="New Password (leave blank to keep)" value={editForm.password} onChange={handleEditChange("password")} />
              <select style={fieldStyle} value={editForm.role} onChange={handleEditChange("role")} required>
                <option value="supervisor">supervisor</option>
                <option value="rm">rm</option>
                <option value="client">client</option>
              </select>
              <select
                style={fieldStyle}
                value={editForm.companyId}
                onChange={handleEditChange("companyId")}
                required={editForm.role !== "superadmin"}
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
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