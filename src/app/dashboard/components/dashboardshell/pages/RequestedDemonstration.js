"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import "./styles/requesteddemonstration.css";

export default function DemoRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for at least 2 seconds
    const timer = setTimeout(() => {
      fetch("/api/demo-requests")
        .then((res) => res.json())
        .then((data) => setRequests(data.data || []))
        .finally(() => setLoading(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "firstname", header: "First Name" },
      { accessorKey: "lastname", header: "Last Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "company", header: "Company" },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "status", header: "Status" },
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
              <button onClick={() => deleteRequest(id)}>Delete</button>
            </div>
          );
        },
      },
    ],
    []
  );

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

  const deleteRequest = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmDelete) return;

    const res = await fetch("/api/demo-requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r._id !== id));
    }
  };

  // Loader UI
  if (loading) {
    return (
      <div className="demo-requests-loader">
        <div className="demo-requests-spinner"></div>
        <p className="demo-requests-loader-text">Your data is being loaded…</p>
      </div>
    );
  }

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
          {requests.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "1rem" }}>
                No data found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
