"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { logUIAction } from "@/lib/logUIAction";
import { ModalButton, ModalGrid, ModalInput, ModalPasswordInput, ModalShell } from "./modalkit/ModalKit";

// Shared Add / Edit RM form (example_modal_4). Submit/close behaviour is owned by the page.
function RMFormModal({ mode, form, onChange, onSubmit, onClose }) {
  const isEdit = mode === "edit";
  const closeLogTitle = isEdit ? "Closed Edit RM form" : "Closed Add RM form";
  return (
    <ModalShell
      icon={isEdit ? "userEdit" : "userPlus"}
      title={isEdit ? "Edit RM" : "Add RM"}
      subtitle={
        isEdit
          ? "Update the relationship manager's details below."
          : "Enter the relationship manager's details below."
      }
      onClose={onClose}
      closeLogTitle={closeLogTitle}
      size="md"
      as="form"
      wrapperProps={{ onSubmit }}
      footer={
        <>
          <ModalButton variant="danger" icon="x" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton type="submit" variant="primary" icon="save">
            {isEdit ? "Save Changes" : "Save"}
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
          hint="This will be used for system login."
          value={form.username}
          onChange={onChange("username")}
        />
        <ModalInput
          label="Full Name"
          required
          icon="users"
          placeholder="Full Name"
          hint="Enter the relationship manager's full name."
          value={form.fullName}
          onChange={onChange("fullName")}
        />
        <ModalInput
          label="Email"
          required
          icon="mail"
          type="email"
          placeholder="Email"
          hint="We'll use this email for notifications and account access."
          value={form.email}
          onChange={onChange("email")}
        />
        <ModalInput
          label="Phone"
          required
          icon="phone"
          placeholder="Phone"
          hint="Include country code if applicable."
          value={form.phone}
          onChange={onChange("phone")}
        />
        {isEdit ? (
          <ModalPasswordInput
            label="New Password"
            placeholder="Leave blank to keep"
            hint="Leave blank to keep the current password."
            value={form.password}
            onChange={onChange("password")}
          />
        ) : (
          <ModalPasswordInput
            label="Password"
            required
            placeholder="Password"
            hint="Use a strong password for the new account."
            value={form.password}
            onChange={onChange("password")}
          />
        )}
      </ModalGrid>
    </ModalShell>
  );
}

export default function RMsPage() {
  const { user } = useUser();
  const [rms, setRms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  const handleDelete = (id) => {
    if (!id) return;
    const target = rms.find((u) => u._id === id) || null;
    setDeleteTarget(target || { _id: id });
  };

  const performDelete = async (target) => {
    const id = target?._id;
    if (!id) return;
    await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setRms((prev) => prev.filter((u) => u._id !== id));
    // 🔒 Audit log: RM deleted (store the removed entry)
    logUIAction("record_deleted", {
      title: `Deleted RM: ${target?.fullName || target?.username || id}`,
      entityType: "rm",
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
    // 🔒 Audit log: RM created (store the created entry, never the password)
    logUIAction("record_created", {
      title: `Created RM: ${result?.user?.fullName || addForm.fullName}`,
      entityType: "rm",
      entity: {
        id: result?.user?._id || null,
        username: addForm.username,
        fullName: addForm.fullName,
        email: addForm.email,
        companyId: user?.companyId || null,
      },
    });
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
    // 🔒 Audit log: RM edited (store the updated entry)
    logUIAction("record_updated", {
      title: `Edited RM: ${result?.user?.fullName || editForm.fullName}`,
      entityType: "rm",
      entity: {
        id: editUserId,
        username: editForm.username,
        fullName: editForm.fullName,
        email: editForm.email,
        companyId: editForm.companyId || null,
      },
    });
    setShowEditModal(false);
    setEditUserId(null);
  };

  const tableTitle = "Relationship Managers";
  const tableDescription = "All your companies registered rms are listed here.";

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
            onClick={() => handleEmail(row?.original?.email)}
            title="Send email now"
            data-log-title={`Email RM button clicked: ${row?.original?.fullName || row?.original?.email || row?.original?._id}`}
            className="dash-action-btn dash-btn-neutral"
            style={{ padding: "0.4rem 0.75rem", textAlign: "center", fontWeight: 700, borderRadius: "0.5rem" }}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => openEditModal(row?.original)}
            title="Edit RM details"
            data-log-title={`Edit RM button clicked: ${row?.original?.fullName || row?.original?.username || row?.original?._id}`}
            className="dash-action-btn dash-btn-green-soft"
            style={{ padding: "0.4rem 0.75rem", textAlign: "center", fontWeight: 700, borderRadius: "0.5rem" }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row?.original?._id)}
            title="Delete RM"
            data-log-title={`Delete RM button clicked: ${row?.original?.fullName || row?.original?.username || row?.original?._id}`}
            className="dash-action-btn dash-btn-danger"
            style={{ padding: "0.4rem 0.75rem", textAlign: "center", fontWeight: 700, borderRadius: "0.5rem" }}
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
        <RMFormModal
          mode="add"
          form={addForm}
          onChange={handleAddChange}
          onSubmit={handleAddSubmit}
          onClose={closeAddModal}
        />
      )}

      {showEditModal && (
        <RMFormModal
          mode="edit"
          form={editForm}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          onClose={closeEditModal}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteTarget}
        itemLabel={
          deleteTarget
            ? `RM "${deleteTarget.fullName || deleteTarget.username || ""}"`
            : "this RM"
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
