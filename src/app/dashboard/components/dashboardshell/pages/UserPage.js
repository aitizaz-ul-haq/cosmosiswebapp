"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Icon, ModalButton, ModalShell } from "./modalkit/ModalKit";
import { UserFormFields } from "./superadmin/SuperadminForms";
import { logUIAction } from "@/lib/logUIAction";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    role: "client",
    companyId: "",
    password: "",
  });

  const handleDelete = (id) => {
    if (!id) return;
    const target = users.find((u) => u._id === id) || null;
    setDeleteTarget(target || { _id: id });
  };

  const performDelete = async (target) => {
    const id = target?._id;
    if (!id) return;
    await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u._id !== id));
    // 🔒 Audit log: user deleted (store the removed entry)
    logUIAction("record_deleted", {
      title: `Deleted user: ${target?.fullName || target?.username || id}`,
      entityType: "user",
      entity: {
        id,
        username: target?.username || null,
        fullName: target?.fullName || null,
        email: target?.email || null,
        role: target?.role || null,
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
          setUsers(data.users || []);
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
      role: user.role || "client",
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
      setUsers((prev) => prev.map((u) => (u._id === result.user._id ? result.user : u)));
    }
    // 🔒 Audit log: user edited (store the updated entry, never the password)
    logUIAction("record_updated", {
      title: `Edited user: ${result?.user?.fullName || editForm.fullName} (${editForm.role})`,
      entityType: "user",
      entity: {
        id: editUserId,
        username: editForm.username,
        fullName: editForm.fullName,
        email: editForm.email,
        role: editForm.role,
        companyId: editForm.companyId || null,
      },
    });
    setShowEditModal(false);
    setEditUserId(null);
  };

  const tableTitle = "Users";
  const tableDescription = "All users in the system. Search, filter, and manage users here.";

  const columns = [
    { accessorKey: "fullName", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "companyName", header: "Company" },
    { accessorKey: "role", header: "Role" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="management-row-actions">
          <button
            type="button"
            onClick={() => handleEmail(row?.original?.email)}
            title="Send email now"
            className="management-row-action is-neutral"
          >
            <Icon name="mail" size={16} />
            Email
          </button>
          <button
            type="button"
            onClick={() => openEditModal(row?.original)}
            title="Edit user details"
            className="management-row-action is-edit"
          >
            <Icon name="pencil" size={16} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row?.original?._id)}
            title="Delete user"
            className="management-row-action is-danger"
          >
            <Icon name="trash" size={16} />
            Delete
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
        filterableFields={columns.filter((col) => col.accessorKey).map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
        onUserCreated={(newUser) => setUsers((prev) => [newUser, ...prev])}
        disableRowModal
      />

      {showEditModal && (
        <ModalShell
          as="form"
          wrapperProps={{ onSubmit: handleEditSubmit }}
          icon="userEdit"
          title="Edit User"
          subtitle="Update the user's account details and access."
          onClose={closeEditModal}
          closeLogTitle="Closed Edit User form"
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
          <UserFormFields
            form={editForm}
            onChange={handleEditChange}
            companies={companies}
            mode="edit"
          />
        </ModalShell>
      )}

      <DeleteConfirmModal
        open={!!deleteTarget}
        itemLabel={
          deleteTarget
            ? `user "${deleteTarget.fullName || deleteTarget.username || ""}"`
            : "this user"
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
