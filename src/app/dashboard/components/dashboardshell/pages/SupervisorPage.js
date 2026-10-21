"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Icon, ModalButton, ModalShell } from "./modalkit/ModalKit";
import { UserFormFields } from "./superadmin/SuperadminForms";
import { logUIAction } from "@/lib/logUIAction";

export default function SupervisorsPage() {
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
    role: "supervisor",
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
            title="Edit supervisor details"
            className="management-row-action is-edit"
          >
            <Icon name="pencil" size={16} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row?.original?._id)}
            title="Delete supervisor"
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
        disableRowModal
      />

      {showEditModal && (
        <ModalShell
          as="form"
          wrapperProps={{ onSubmit: handleEditSubmit }}
          icon="userEdit"
          title="Edit Supervisor"
          subtitle="Update the supervisor's account details and access."
          onClose={closeEditModal}
          closeLogTitle="Closed Edit Supervisor form"
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
            ? `supervisor "${deleteTarget.fullName || deleteTarget.username || ""}"`
            : "this supervisor"
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
