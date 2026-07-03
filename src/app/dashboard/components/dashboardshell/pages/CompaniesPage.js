"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import { logUIAction } from "@/lib/logUIAction";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    legalName: "",
    tenantKey: "",
    status: "active",
    primaryContact: { fullName: "", email: "", phone: "" },
    address: {
      line1: "",
      line2: "",
      city: "",
      stateOrProvince: "",
      postalCode: "",
      country: "",
    },
    registrationNumber: "",
    taxId: "",
    website: "",
    logoUrl: "",
    notes: "",
  });

  //keith brown Helloworld

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this company?")) return;
    const target = companies.find((c) => c._id === id) || null;
    await fetch(`/api/companies?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setCompanies((prev) => prev.filter((c) => c._id !== id));
    // 🔒 Audit log: company deleted (store the removed entry)
    logUIAction("record_deleted", {
      title: `Deleted company: ${target?.name || id}`,
      entityType: "company",
      entity: {
        id,
        name: target?.name || null,
        tenantKey: target?.tenantKey || null,
        email: target?.primaryContact?.email || null,
      },
    });
  };

  const handleEmail = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const next = { ...obj };
    let cur = next;
    for (let i = 0; i < keys.length - 1; i++) {
      cur[keys[i]] = { ...cur[keys[i]] };
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    return next;
  };

  const handleEditChange = (path) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setEditForm((prev) => setNestedValue(prev, path, value));
  };

  const openEditModal = (company) => {
    if (!company?._id) return;
    setEditCompanyId(company._id);
    setEditForm({
      name: company.name || "",
      legalName: company.legalName || "",
      tenantKey: company.tenantKey || "",
      status: company.status || "active",
      primaryContact: {
        fullName: company.primaryContact?.fullName || "",
        email: company.primaryContact?.email || "",
        phone: company.primaryContact?.phone || "",
      },
      address: {
        line1: company.address?.line1 || "",
        line2: company.address?.line2 || "",
        city: company.address?.city || "",
        stateOrProvince: company.address?.stateOrProvince || "",
        postalCode: company.address?.postalCode || "",
        country: company.address?.country || "",
      },
      registrationNumber: company.registrationNumber || "",
      taxId: company.taxId || "",
      website: company.website || "",
      logoUrl: company.logoUrl || "",
      notes: company.notes || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCompanyId) return;
    const res = await fetch(`/api/companies?id=${encodeURIComponent(editCompanyId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(result?.error || "Failed to update company");
      return;
    }
    if (result?.company?._id) {
      setCompanies((prev) => prev.map((c) => (c._id === result.company._id ? result.company : c)));
    }
    // 🔒 Audit log: company edited (store the updated entry)
    logUIAction("record_updated", {
      title: `Edited company: ${result?.company?.name || editForm.name}`,
      entityType: "company",
      entity: {
        id: editCompanyId,
        name: result?.company?.name || editForm.name,
        tenantKey: editForm.tenantKey,
        email: editForm.primaryContact?.email,
        status: editForm.status,
      },
    });
    setShowEditModal(false);
    setEditCompanyId(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditCompanyId(null);
  };

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))
      .finally(() => setLoading(false));
  }, []);

  const tableTitle ="Companies";
  const tableDescription = "All companies in the system. Search, filter, and manage companies here.";

  const fieldStyle = {
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "6px",
  };

  const modalActionBtnStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "1rem",
    color: "#fff",
  };
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
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => openEditModal(row?.original)}
            style={{
              padding: "0.4rem 0.75rem",
              textAlign: "center",
              fontWeight: 700,
              borderRadius: "0.5rem",
              backgroundColor: "var(--sitegreen)",
              border: "1px solid var(--sitegreen)",
              color: "#fff",
            }}
          >
            Edit
          </button>
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
          <button
            type="button"
            onClick={() => handleEmail(row?.original?.primaryContact?.email)}
            style={{
              padding: "0.4rem 0.75rem",
              textAlign: "center",
              fontWeight: 700,
              borderRadius: "0.5rem",
              backgroundColor: "#6D7692",
              border: "1px solid #6D7692",
              color: "#fff",
            }}
          >
            Email
          </button>
        </div>
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
        filterableFields={columns.filter((col) => col.accessorKey).map((col) => col.accessorKey)}
        actions={[]}
        loading={loading}
        onCompanyCreated={(newCompany) => setCompanies((prev) => [newCompany, ...prev])}
        disableRowModal
      />

      {showEditModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleEditSubmit}
            style={{
              background: "#fff",
              width: "min(900px, 92vw)",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "1.25rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Edit Company</h3>
              <button type="button" onClick={closeEditModal} data-log-title="Closed Edit Company form" style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={fieldStyle} placeholder="Name" value={editForm.name} onChange={handleEditChange("name")} required />
              <input style={fieldStyle} placeholder="Legal Name" value={editForm.legalName} onChange={handleEditChange("legalName")} required />
              <input style={fieldStyle} placeholder="Tenant Key (slug)" value={editForm.tenantKey} onChange={handleEditChange("tenantKey")} required />
              <select style={fieldStyle} value={editForm.status} onChange={handleEditChange("status")} required>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              <input style={fieldStyle} placeholder="Primary Contact Full Name" value={editForm.primaryContact.fullName} onChange={handleEditChange("primaryContact.fullName")} required />
              <input style={fieldStyle} placeholder="Primary Contact Email" value={editForm.primaryContact.email} onChange={handleEditChange("primaryContact.email")} required />
              <input style={fieldStyle} placeholder="Primary Contact Phone" value={editForm.primaryContact.phone} onChange={handleEditChange("primaryContact.phone")} required />

              <input style={fieldStyle} placeholder="Address Line 1" value={editForm.address.line1} onChange={handleEditChange("address.line1")} required />
              <input style={fieldStyle} placeholder="Address Line 2" value={editForm.address.line2} onChange={handleEditChange("address.line2")} required />
              <input style={fieldStyle} placeholder="City" value={editForm.address.city} onChange={handleEditChange("address.city")} required />
              <input style={fieldStyle} placeholder="State/Province" value={editForm.address.stateOrProvince} onChange={handleEditChange("address.stateOrProvince")} required />
              <input style={fieldStyle} placeholder="Postal Code" value={editForm.address.postalCode} onChange={handleEditChange("address.postalCode")} required />
              <input style={fieldStyle} placeholder="Country" value={editForm.address.country} onChange={handleEditChange("address.country")} required />

              <input style={fieldStyle} placeholder="Registration Number" value={editForm.registrationNumber} onChange={handleEditChange("registrationNumber")} required />
              <input style={fieldStyle} placeholder="Tax ID" value={editForm.taxId} onChange={handleEditChange("taxId")} required />
              <input style={fieldStyle} placeholder="Website" value={editForm.website} onChange={handleEditChange("website")} required />
              <input style={fieldStyle} placeholder="Logo URL" value={editForm.logoUrl} onChange={handleEditChange("logoUrl")} required />

              <textarea style={fieldStyle} placeholder="Notes" value={editForm.notes} onChange={handleEditChange("notes")} rows={3} required />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={closeEditModal}
                style={{ ...modalActionBtnStyle, backgroundColor: "#d32f2f" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--sitegreen)" }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}