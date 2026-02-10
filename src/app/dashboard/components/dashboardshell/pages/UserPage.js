"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this user?")) return;
    await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u._id !== id));
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
        onUserCreated={(newUser) => setUsers((prev) => [newUser, ...prev])}
      />
    </div>
  );
}
