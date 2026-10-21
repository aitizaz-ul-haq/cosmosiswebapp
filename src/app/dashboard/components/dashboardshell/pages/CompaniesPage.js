"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Icon, ModalButton, ModalShell } from "./modalkit/ModalKit";
import { CompanyFormFields } from "./superadmin/SuperadminForms";
import { logUIAction } from "@/lib/logUIAction";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  const handleDelete = (id) => {
    if (!id) return;
    const target = companies.find((c) => c._id === id) || null;
    setDeleteTarget(target || { _id: id });
  };

  const performDelete = async (target) => {
    const id = target?._id;
    if (!id) return;
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
        <div className="management-row-actions">
          <button
            type="button"
            onClick={() => handleEmail(row?.original?.primaryContact?.email)}
            title="Send email now"
            className="management-row-action is-neutral"
          >
            <Icon name="mail" size={16} />
            Email
          </button>
          <button
            type="button"
            onClick={() => openEditModal(row?.original)}
            title="Edit company details"
            className="management-row-action is-edit"
          >
            <Icon name="pencil" size={16} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row?.original?._id)}
            title="Delete company"
            className="management-row-action is-danger"
          >
            <Icon name="trash" size={16} />
            Delete
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
        <ModalShell
          as="form"
          wrapperProps={{ onSubmit: handleEditSubmit }}
          icon="building"
          title="Edit Company"
          subtitle="Update the company's details, contact information, and settings."
          onClose={closeEditModal}
          closeLogTitle="Closed Edit Company form"
          size="lg"
          overlayClassName="mk-company-overlay"
          dismissOnOverlay={false}
          footer={
            <>
              <ModalButton variant="danger" onClick={closeEditModal}>
                Cancel
              </ModalButton>
              <ModalButton variant="primary" icon="save" type="submit">
                Save Changes
              </ModalButton>
            </>
          }
        >
          <CompanyFormFields
            form={editForm}
            onChange={handleEditChange}
            mode="edit"
          />
        </ModalShell>
      )}

      <DeleteConfirmModal
        open={!!deleteTarget}
        itemLabel={deleteTarget ? `company "${deleteTarget.name || ""}"` : "this company"}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await performDelete(deleteTarget);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
