"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this user?")) return;
    await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false));
  }, []);

  const tableTitle = "Users";
  const tableDescription = "All users in the system. Search, filter, and manage users here.";

  const columns = [
    { accessorKey: "username", header: "Username" },
    // { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "companyId", header: "Company" },
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
      <GenericTable
        title={tableTitle}
        description={tableDescription}
        data={users}
        columns={columns}
        filterableFields={columns.map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
      />
    </div>
  );
}
