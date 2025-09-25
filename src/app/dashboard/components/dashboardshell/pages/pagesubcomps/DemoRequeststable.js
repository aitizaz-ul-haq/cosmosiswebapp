"use client";
import { useEffect, useState } from "react";

export default function DemoRequestsTable() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/api/demo-requests")
      .then((res) => res.json())
      .then((data) => setRequests(data.data || []));
  }, []);

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
    <div>
      <h2>Demo Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Company</th>
            <th>Role</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r._id}>
              <td>{r.firstname} {r.lastname}</td>
              <td>{r.email}</td>
              <td>{r.company}</td>
              <td>{r.role}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => updateStatus(r._id, "approved")}>Approve</button>
                <button onClick={() => updateStatus(r._id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
