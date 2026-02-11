"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import TableModal from "./pagecomponents/tablemodal";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import GenericTableHeader from "./pagecomponents/generictablecomps/generictableheader";
import GenericTableThead from "./pagecomponents/generictablecomps/generictablethead";
import GenericTableTbody from "./pagecomponents/generictablecomps/generictabletbody";
import "./styles/generictable.css";

export default function GenericTable({
  title = "Table",
  description = "",
  data = [],
  columns = [],
  filterableFields = [],
  actions = [],
  loading = false,
  onUserCreated,
  onCompanyCreated,
  disableRowModal = false,
  onAddRM,
  onAddClient,
}) {
  const [filterField, setFilterField] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyForm, setCompanyForm] = useState({
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
    brand: { primaryColor: "", secondaryColor: "", emailFromName: "" },
    notes: "",
  });
  const [userForm, setUserForm] = useState({
    username: "",
    passwordHash: "",
    role: "client",
    companyId: "",
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!showAddUserModal) return;
    fetch("/api/companies", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCompanies(Array.isArray(data.companies) ? data.companies : []))
      .catch(() => setCompanies([]));
  }, [showAddUserModal]);

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

  const handleCompanyChange = (path) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setCompanyForm((prev) => setNestedValue(prev, path, value));
  };

  const handleUserChange = (key) => (e) => {
    const value = e?.target?.value ?? "";
    setUserForm((prev) => ({ ...prev, [key]: value }));
  };

  const isEmpty = (v) =>
    v == null || (typeof v === "string" && v.trim() === "");

  const isCompanyFormValid = (f) =>
    ![
      f.name,
      f.legalName,
      f.tenantKey,
      f.status,
      f.primaryContact.fullName,
      f.primaryContact.email,
      f.primaryContact.phone,
      f.address.line1,
      f.address.line2,
      f.address.city,
      f.address.stateOrProvince,
      f.address.postalCode,
      f.address.country,
      f.registrationNumber,
      f.taxId,
      f.website,
      f.logoUrl,
      f.brand.primaryColor,
      f.brand.secondaryColor,
      f.brand.emailFromName,
      f.notes,
    ].some(isEmpty);

  const isUserFormValid = (f) =>
    ![f.username, f.passwordHash, f.role, f.companyId, f.fullName, f.email, f.phone].some(isEmpty);

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!isCompanyFormValid(companyForm)) return;
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(companyForm),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(result?.error || "Failed to create company");
      return;
    }
    if (result?.company && typeof onCompanyCreated === "function") {
      onCompanyCreated(result.company);
    }
    setCompanyForm({
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
      brand: { primaryColor: "", secondaryColor: "", emailFromName: "" },
      notes: "",
    });
    setShowAddCompanyModal(false);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!isUserFormValid(userForm)) return;
    const payload = {
      ...userForm,
      companyId: userForm.companyId || null,
    };
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(result?.error || "Failed to create user");
      return;
    }
    if (result?.user && typeof onUserCreated === "function") {
      onUserCreated(result.user);
    }
    setUserForm({
      username: "",
      passwordHash: "",
      role: "client",
      companyId: "",
      fullName: "",
      email: "",
      phone: "",
    });
    setShowAddUserModal(false);
  };

  const fieldStyle = {
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "6px",
  };

  const labelStyle = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    fontSize: "0.95rem",
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

  // 🔍 Filter logic
  const filteredData = useMemo(() => {
    return data.filter((r) => {
      if (filterField === "all" || filterValue === "") return true;
      if (filterField.toLowerCase().includes("date")) {
        return new Date(r[filterField])
          .toLocaleDateString()
          .includes(filterValue);
      }
      return r[filterField]
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });
  }, [data, filterField, filterValue]);

  // Table setup
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <GenericTableLoader />;
  }

  return (
    <div className="generic-table-container">
      {/* Header */}
      <GenericTableHeader
        title={title}
        description={description}
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterableFields={filterableFields}
      />

      {title === "Companies" && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
          <button
            type="button"
            onClick={() => setShowAddCompanyModal(true)}
            style={{
              backgroundColor: "var(--sitegreen)",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            + Add Companies
          </button>
        </div>
      )}

      {title === "Users" && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
          <button
            type="button"
            onClick={() => setShowAddUserModal(true)}
            style={{
              backgroundColor: "var(--sitegreen)",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            + Add User
          </button>
        </div>
      )}

      {title === "Relationship Managers" && onAddRM && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
          <button
            type="button"
            onClick={onAddRM}
            style={{
              backgroundColor: "var(--sitegreen)",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            + Add RM
          </button>
        </div>
      )}

      {title === "Clients" && onAddClient && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
          <button
            type="button"
            onClick={onAddClient}
            style={{
              backgroundColor: "var(--sitegreen)",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            + Add Clients
          </button>
        </div>
      )}

      {/* Table */}
      <table className="generic-table">
        <GenericTableThead table={table} actions={actions} />
        <GenericTableTbody
          table={table}
          filteredData={filteredData}
          columns={columns}
          actions={actions}
          setSelectedRow={disableRowModal ? null : setSelectedRow}
        />
      </table>

      {showAddCompanyModal && (
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
            onSubmit={handleCompanySubmit}
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
              <h3 style={{ margin: 0, textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Add Company</h3>
              <button type="button" onClick={() => setShowAddCompanyModal(false)} style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={fieldStyle} placeholder="Name" value={companyForm.name} onChange={handleCompanyChange("name")} required />
              <input style={fieldStyle} placeholder="Legal Name" value={companyForm.legalName} onChange={handleCompanyChange("legalName")} required />
              <input style={fieldStyle} placeholder="Tenant Key (slug)" value={companyForm.tenantKey} onChange={handleCompanyChange("tenantKey")} required />
              <select style={fieldStyle} value={companyForm.status} onChange={handleCompanyChange("status")} required>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              <input style={fieldStyle} placeholder="Primary Contact Full Name" value={companyForm.primaryContact.fullName} onChange={handleCompanyChange("primaryContact.fullName")} required />
              <input style={fieldStyle} placeholder="Primary Contact Email" value={companyForm.primaryContact.email} onChange={handleCompanyChange("primaryContact.email")} required />
              <input style={fieldStyle} placeholder="Primary Contact Phone" value={companyForm.primaryContact.phone} onChange={handleCompanyChange("primaryContact.phone")} required />

              <input style={fieldStyle} placeholder="Address Line 1" value={companyForm.address.line1} onChange={handleCompanyChange("address.line1")} required />
              <input style={fieldStyle} placeholder="Address Line 2" value={companyForm.address.line2} onChange={handleCompanyChange("address.line2")} required />
              <input style={fieldStyle} placeholder="City" value={companyForm.address.city} onChange={handleCompanyChange("address.city")} required />
              <input style={fieldStyle} placeholder="State/Province" value={companyForm.address.stateOrProvince} onChange={handleCompanyChange("address.stateOrProvince")} required />
              <input style={fieldStyle} placeholder="Postal Code" value={companyForm.address.postalCode} onChange={handleCompanyChange("address.postalCode")} required />
              <input style={fieldStyle} placeholder="Country" value={companyForm.address.country} onChange={handleCompanyChange("address.country")} required />

              <input style={fieldStyle} placeholder="Registration Number" value={companyForm.registrationNumber} onChange={handleCompanyChange("registrationNumber")} required />
              <input style={fieldStyle} placeholder="Tax ID" value={companyForm.taxId} onChange={handleCompanyChange("taxId")} required />
              <input style={fieldStyle} placeholder="Website" value={companyForm.website} onChange={handleCompanyChange("website")} required />
              <input style={fieldStyle} placeholder="Logo URL" value={companyForm.logoUrl} onChange={handleCompanyChange("logoUrl")} required />

              <input style={fieldStyle} placeholder="Brand Primary Color" value={companyForm.brand.primaryColor} onChange={handleCompanyChange("brand.primaryColor")} required />
              <input style={fieldStyle} placeholder="Brand Secondary Color" value={companyForm.brand.secondaryColor} onChange={handleCompanyChange("brand.secondaryColor")} required />
              <input style={fieldStyle} placeholder="Email From Name" value={companyForm.brand.emailFromName} onChange={handleCompanyChange("brand.emailFromName")} required />

              <textarea style={fieldStyle} placeholder="Notes" value={companyForm.notes} onChange={handleCompanyChange("notes")} rows={3} required />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setShowAddCompanyModal(false)}
                style={{ ...modalActionBtnStyle, backgroundColor: "#d32f2f" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--sitegreen)" }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddUserModal && (
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
            onSubmit={handleUserSubmit}
            style={{
              background: "#fff",
              width: "min(700px, 92vw)",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "1.25rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Add User</h3>
              <button type="button" onClick={() => setShowAddUserModal(false)} style={{ border: "none", background: "transparent", fontSize: "1.25rem" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input style={fieldStyle} placeholder="Username" value={userForm.username} onChange={handleUserChange("username")} required />
              <input style={fieldStyle} placeholder="Full Name" value={userForm.fullName} onChange={handleUserChange("fullName")} required />
              <input style={fieldStyle} type="email" placeholder="Email" value={userForm.email} onChange={handleUserChange("email")} required />
              <input style={fieldStyle} placeholder="Phone" value={userForm.phone} onChange={handleUserChange("phone")} required />
              <input style={fieldStyle} type="password" placeholder="Password" value={userForm.passwordHash} onChange={handleUserChange("passwordHash")} required />
              <select style={fieldStyle} value={userForm.role} onChange={handleUserChange("role")} required>
                <option value="supervisor">supervisor</option>
                <option value="rm">rm</option>
                <option value="client">client</option>
              </select>
              <select style={fieldStyle} value={userForm.companyId} onChange={handleUserChange("companyId")} required>
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                style={{ ...modalActionBtnStyle, backgroundColor: "#d32f2f" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...modalActionBtnStyle, backgroundColor: "var(--sitegreen)" }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal */}
      {!disableRowModal && (
        <TableModal
          data={selectedRow}
          onClose={() => setSelectedRow(null)}
          actions={actions.filter((a) => a.type !== "details")}
        />
      )}
    </div>
  );
}
