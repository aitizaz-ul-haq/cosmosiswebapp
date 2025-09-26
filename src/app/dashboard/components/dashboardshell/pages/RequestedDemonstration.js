"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import "./styles/requesteddemonstration.css";

function RequestDetailsModal({ request, onClose, onApprove, onReject, onDelete }) {
  if (!request) return null; // don’t render at all when closed

  return (
    <div className="demo-requests-modal">
      <div className="demo-requests-modal-content">
        <button className="demo-requests-modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Request Details</h3>
        <p><b>Name:</b> {request.firstname} {request.lastname}</p>
        <p><b>Email:</b> {request.email}</p>
        <p><b>Phone:</b> {request.phone}</p>
        <p><b>Company:</b> {request.company}</p>
        <p><b>Role:</b> {request.role}</p>
        <p><b>Status:</b> {request.status}</p>
        <p><b>Date:</b> {new Date(request.createdAt).toLocaleString()}</p>
        <p><b>Message:</b> {request.message}</p>

        <div className="demo-requests-modal-actions">
          <button onClick={() => onApprove(request._id)}>Approve</button>
          <button onClick={() => onReject(request._id)}>Reject</button>
          <button onClick={() => onDelete(request._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function DemoRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterField, setFilterField] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("/api/demo-requests")
        .then((res) => res.json())
        .then((data) => setRequests(data.data || []))
        .finally(() => setLoading(false));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔍 Memoized Filter logic
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (filterField === "all" || filterValue === "") return true;
      if (filterField === "createdAt") {
        return new Date(r.createdAt).toLocaleDateString().includes(filterValue);
      }
      return r[filterField]
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });
  }, [requests, filterField, filterValue]);

  // ✅ Update status
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
      if (selectedRequest?._id === id) {
        setSelectedRequest((prev) => ({ ...prev, status }));
      }
    }
  };

  // 🗑️ Delete
  const deleteRequest = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    const res = await fetch("/api/demo-requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r._id !== id));
      if (selectedRequest?._id === id) setSelectedRequest(null);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "firstname", header: "First Name" },
      { accessorKey: "lastname", header: "Last Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "company", header: "Company" },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "status", header: "Status" },
      {
        accessorKey: "createdAt",
        header: "Date Submitted",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const id = row.original._id;
          return (
            <div className="demo-requests-actions">
              <button onClick={() => setSelectedRequest(row.original)}>
                Details
              </button>
              <button onClick={() => updateStatus(id, "approved")}>Approve</button>
              <button onClick={() => updateStatus(id, "rejected")}>Reject</button>
              <button onClick={() => deleteRequest(id)}>Delete</button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Loader
  if (loading) {
    return (
      <div className="demo-requests-loader">
        <div className="demo-requests-spinner"></div>
        <p className="demo-requests-loader-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="demo-requests-container">
      {/* Filters */}
      <div className="demo-requests-header">
        <h2 className="demo-requests-heading">Demo Requests</h2>
        <div className="demo-requests-filters">
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="all">All Fields</option>
            <option value="firstname">First Name</option>
            <option value="lastname">Last Name</option>
            <option value="email">Email</option>
            <option value="company">Company</option>
            <option value="role">Role</option>
            <option value="status">Status</option>
            <option value="createdAt">Date</option>
          </select>
          <input
            type={filterField === "createdAt" ? "date" : "text"}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={
              filterField === "createdAt" ? "Select date" : "Enter filter value"
            }
          />
        </div>
      </div>

      {/* Table */}
      <table className="demo-requests-table">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
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

      {/* Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={(id) => updateStatus(id, "approved")}
        onReject={(id) => updateStatus(id, "rejected")}
        onDelete={(id) => deleteRequest(id)}
      />
    </div>
  );
}
