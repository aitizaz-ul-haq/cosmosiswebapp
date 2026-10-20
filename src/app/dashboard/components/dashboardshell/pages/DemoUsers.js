"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import { StatusPill } from "./modalkit/ModalKit";

export default function DemoUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("/api/demo-users")
        .then((res) => res.json())
        .then((data) => setUsers(data.data || []))
        .finally(() => setLoading(false));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { accessorKey: "username", header: "Username" },
    { accessorKey: "passwordHash", header: "Password" },
    { accessorKey: "company", header: "Company" },
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname", header: "Last Name" },
    {
      accessorKey: "subscriptionStatus",
      header: "Subscription Status",
      cell: ({ getValue }) => (
        <StatusPill status={getValue()} tone="amber" className="status-badge">
          {getValue()}
        </StatusPill>
      ),
    },
  ];

  return (
    <GenericTable
      title="Demo Users"
      description="All users currently in demo status. Manage and monitor demo users here."
      data={users}
      columns={columns}
      filterableFields={[
        "username",
        "role",
        "companyId",
        "subscriptionStatus",
        "createdAt",
      ]}
      actions={[]}
      loading={loading}
    />
  );
}
