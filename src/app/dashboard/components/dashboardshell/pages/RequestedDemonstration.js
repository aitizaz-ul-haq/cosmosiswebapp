"use client";

import { useEffect, useState } from "react";
// import GenericTable from "./shared/GenericTable";
import GenericTable from "./GenericTable";

export default function DemoRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("/api/demo-requests")
        .then((res) => res.json())
        .then((data) => setRequests(data.data || []))
        .finally(() => setLoading(false));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("/api/demo-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status } : r))
    );
  };

  const deleteRequest = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch("/api/demo-requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  const columns = [
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "company", header: "Company" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue()?.toLowerCase();
        let className = "status-badge";
        if (status === "pending") className += " status-pending";
        if (status === "approved" || status === "active")
          className += " status-active";
        if (status === "rejected" || status === "inactive")
          className += " status-rejected";

        return <span className={className}>{getValue()}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Submitted",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    },
  ];

  const actions = [
    { type: "details", label: "Details", className: "generic-btn-details" },
    {
      label: "Approve",
      className: "generic-btn-approve",
      onClick: (id) => updateStatus(id, "approved"),
    },
    {
      label: "Reject",
      className: "generic-btn-reject",
      onClick: (id) => updateStatus(id, "rejected"),
    },
    {
      label: "Delete",
      className: "generic-btn-delete",
      onClick: deleteRequest,
    },
  ];

  return (
    <GenericTable
      title="Demo Requests"
      description="Manage and address demo requests by companies here"
      data={requests}
      columns={columns}
      filterableFields={[
        "firstname",
        "lastname",
        "email",
        "company",
        "role",
        "status",
        "createdAt",
      ]}
      actions={actions}
      loading={loading}
    />
  );
}
