"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import "./styles/requesteddemonstration.css"

export default function DemoRequestsTable() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/api/demo-requests")
      .then((res) => res.json())
      .then((data) => setRequests(data.data || []));
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "firstname",
        header: "First Name",
      },
      {
        accessorKey: "lastname",
        header: "Last Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "company",
        header: "Company",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const id = row.original._id;
          return (
            <div>
              <button onClick={() => updateStatus(id, "approved")}>
                Approve
              </button>
              <button onClick={() => updateStatus(id, "rejected")}>
                Reject
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Table instance
  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const updateStatus = async (id, status) => {
    const res = await fetch("/api/demo-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    }
  };

 return (
  <div className="demo-requests-container">
    <h2 className="demo-requests-heading">Demo Requests</h2>
    <table className="demo-requests-table">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}
