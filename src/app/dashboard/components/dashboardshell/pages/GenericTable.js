"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import TableModal from "./pagecomponents/tablemodal";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import GenericTableThead from "./pagecomponents/generictablecomps/generictablethead";
import GenericTableTbody from "./pagecomponents/generictablecomps/generictabletbody";
import ManagementTableToolbar from "./pagecomponents/ManagementTableToolbar";
import ManagementTablePagination from "./pagecomponents/ManagementTablePagination";
import TablePageLayout from "./pagecomponents/TablePageLayout";
import { AddCompanyModal, AddUserModal } from "./superadmin/SuperadminForms";
import { logUIAction } from "@/lib/logUIAction";

export default function GenericTable({
  title = "Table",
  description = "",
  className = "",
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
  hideDefaultFilter = false,
  filtersSlot = null,
}) {
  const PAGE_SIZE = 8;
  const [filterField, setFilterField] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
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
    // 🔒 Audit log: company created (store the created entry)
    logUIAction("record_created", {
      title: `Created company: ${result?.company?.name || companyForm.name}`,
      entityType: "company",
      entity: {
        id: result?.company?._id || null,
        name: result?.company?.name || companyForm.name,
        legalName: companyForm.legalName,
        tenantKey: companyForm.tenantKey,
        email: companyForm.primaryContact?.email,
      },
    });
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
    // 🔒 Audit log: user created (store the created entry, never the password)
    logUIAction("record_created", {
      title: `Created user: ${result?.user?.fullName || userForm.fullName} (${userForm.role})`,
      entityType: "user",
      entity: {
        id: result?.user?._id || null,
        username: userForm.username,
        fullName: userForm.fullName,
        email: userForm.email,
        role: userForm.role,
        companyId: userForm.companyId || null,
      },
    });
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

  const searchableFields = useMemo(() => {
    const fields = filterableFields.filter(Boolean);
    return fields.length ? fields : columns
      .filter((column) => column.accessorKey || column.accessorFn)
      .map((column) => column.accessorKey || column.id)
      .filter(Boolean);
  }, [columns, filterableFields]);

  const filteredData = useMemo(() => {
    const query = filterValue.trim().toLowerCase();
    if (!query) return data;
    const fields = filterField === "all" ? searchableFields : [filterField];
    return data.filter((row, index) => fields.some((field) => {
      const column = columns.find((item) => (item.accessorKey || item.id) === field);
      const value = column?.accessorFn
        ? column.accessorFn(row, index)
        : field.split(".").reduce((current, key) => current?.[key], row);
      const text = value instanceof Date ? value.toISOString() : String(value ?? "");
      return text.toLowerCase().includes(query);
    }));
  }, [data, columns, filterField, filterValue, searchableFields]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filterField, filterValue, filteredData.length]);

  // Table setup
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const addAction = title === "Companies"
    ? { onClick: () => setShowAddCompanyModal(true), label: "Add Company", logTitle: "New Company button clicked" }
    : title === "Users"
      ? { onClick: () => setShowAddUserModal(true), label: "Add User", logTitle: "New User button clicked" }
      : onAddRM
        ? { onClick: onAddRM, label: "Add RM", logTitle: "New RM button clicked" }
        : onAddClient
          ? { onClick: onAddClient, label: "Add Client", logTitle: "New Client button clicked" }
          : null;

  return (
    <>
      <TablePageLayout title={title} description={description} loading={loading} className={className}>
        <ManagementTableToolbar
          title={title}
          columns={columns}
          filterableFields={searchableFields}
          filterField={filterField}
          setFilterField={setFilterField}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          hideDefaultFilter={hideDefaultFilter}
          customFilters={filtersSlot}
          onAdd={addAction?.onClick}
          addLabel={addAction?.label}
          addLogTitle={addAction?.logTitle}
        />
        {loading ? <GenericTableLoader /> : (
          <>
            <div className="management-table-scroll" role="region" aria-label={`${title} table`} tabIndex={0}>
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
            </div>
            <ManagementTablePagination
              pagination={pagination}
              total={filteredData.length}
              onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
            />
          </>
        )}
      </TablePageLayout>

      {showAddCompanyModal && (
        <AddCompanyModal
          form={companyForm}
          onChange={handleCompanyChange}
          onSubmit={handleCompanySubmit}
          onClose={() => setShowAddCompanyModal(false)}
        />
      )}

      {showAddUserModal && (
        <AddUserModal
          form={userForm}
          onChange={handleUserChange}
          onSubmit={handleUserSubmit}
          onClose={() => setShowAddUserModal(false)}
          companies={companies}
        />
      )}

      {/* Modal */}
      {!disableRowModal && (
        <TableModal
          data={selectedRow}
          onClose={() => setSelectedRow(null)}
          actions={actions.filter((a) => a.type !== "details")}
        />
      )}
    </>
  );
}
