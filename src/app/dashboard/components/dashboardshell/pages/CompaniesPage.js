"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this company?")) return;
    await fetch(`/api/companies?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setCompanies((prev) => prev.filter((c) => c._id !== id));
  };

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))
      .finally(() => setLoading(false));
  }, []);

  const tableTitle ="Companies";
  const tableDescription = "All companies in the system. Search, filter, and manage companies here.";


  // Use fixed columns for the companies table
  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "legalName", header: "Legal Name" },
    { accessorKey: "tenantKey", header: "Tenant Key" },
    { accessorKey: "primaryContact.fullName", header: "Primary Contact" },
    { accessorKey: "primaryContact.email", header: "Email" },
    { accessorKey: "primaryContact.phone", header: "Phone" },
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
        data={companies}
        columns={columns}
        filterableFields={columns.map(col => col.accessorKey)}
        actions={[]}
        loading={loading}
      />
    </div>
  );
}