"use client";

import GenericTable from "./GenericTable";

const columns = [
  { accessorKey: "name", header: "Report" },
  { accessorKey: "companyName", header: "Company" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "createdDate", header: "Created Date" },
  { accessorKey: "status", header: "Status" },
];

export default function ReportsPage() {
  return (
    <GenericTable
      title="Reports"
      description="View reports across the platform. Search and filter by report, company, type, date, or status."
      data={[]}
      columns={columns}
      filterableFields={columns.map((column) => column.accessorKey)}
      disableRowModal
    />
  );
}
