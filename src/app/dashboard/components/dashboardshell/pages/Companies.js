"use client";

import { useEffect, useMemo, useState } from "react";
import GenericTable from "./GenericTable";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Define ONLY the columns you want to show for Companies
  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "legalName", header: "Legal Name" },
      { accessorKey: "tenantKey", header: "Tenant Key" },
    ],
    []
  );

  // ✅ Only allow filtering on these fields
  const filterableFields = useMemo(
    () => ["name", "legalName", "tenantKey"],
    []
  );

  return (
    <div>
      <GenericTable
        title="Companies"
        description="All companies in the system. Search, filter, and manage companies here."
        data={companies}
        columns={columns}
        filterableFields={filterableFields}
        actions={[]}
        loading={loading}
      />
    </div>
  );
}
