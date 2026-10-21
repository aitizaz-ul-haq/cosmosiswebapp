"use client";

import {
  ModalButton,
  ModalGrid,
  ModalInput,
  ModalPasswordInput,
  ModalSection,
  ModalSelect,
  ModalShell,
  ModalTextarea,
} from "../modalkit/ModalKit";

const valueAt = (form, path) =>
  path.split(".").reduce((value, key) => value?.[key], form) ?? "";

function CompanyInput({ form, onChange, path, label, icon }) {
  return (
    <ModalInput
      label={label}
      icon={icon}
      required
      placeholder={label}
      value={valueAt(form, path)}
      onChange={onChange(path)}
    />
  );
}

export function CompanyFormFields({ form, onChange, mode = "create" }) {
  const input = (path, label, icon) => (
    <CompanyInput form={form} onChange={onChange} path={path} label={label} icon={icon} />
  );

  return (
    <>
      <ModalSection
        icon="building"
        tone="green"
        title="Company details"
        description="Company identity and account status."
      >
        <ModalGrid>
          {input("name", "Company name", "building")}
          {input("legalName", "Legal name", "briefcase")}
          {input("tenantKey", "Tenant key (slug)", "key")}
          <ModalSelect
            label="Status"
            icon="checkCircle"
            required
            value={form.status}
            onChange={onChange("status")}
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </ModalSelect>
          {input("registrationNumber", "Registration number", "file")}
          {input("taxId", "Tax ID", "id")}
        </ModalGrid>
      </ModalSection>

      <ModalSection
        icon="user"
        tone="blue"
        title="Primary contact"
        description="The main point of contact for this company."
      >
        <ModalGrid>
          {input("primaryContact.fullName", "Contact full name", "user")}
          {input("primaryContact.email", "Contact email", "mail")}
          {input("primaryContact.phone", "Contact phone", "phone")}
        </ModalGrid>
      </ModalSection>

      <ModalSection icon="pin" tone="violet" title="Company address" description="Office and mailing address.">
        <ModalGrid>
          {input("address.line1", "Address line 1", "pin")}
          {input("address.line2", "Address line 2", "pin")}
          {input("address.city", "City", "building")}
          {input("address.stateOrProvince", "State / province", "pin")}
          {input("address.postalCode", "Postal code", "mail")}
          {input("address.country", "Country", "globe")}
        </ModalGrid>
      </ModalSection>

      <ModalSection icon="globe" tone="blue" title="Online presence" description="Company website and logo.">
        <ModalGrid>
          {input("website", "Website", "globe")}
          {input("logoUrl", "Logo URL", "file")}
        </ModalGrid>
      </ModalSection>

      {mode === "create" ? (
        <ModalSection icon="pen" tone="violet" title="Brand settings" description="Brand colors and the sender name used in emails.">
          <ModalGrid>
            {input("brand.primaryColor", "Brand primary color", "pen")}
            {input("brand.secondaryColor", "Brand secondary color", "pen")}
            {input("brand.emailFromName", "Email from name", "mail")}
          </ModalGrid>
        </ModalSection>
      ) : null}

      <ModalSection icon="file" title="Additional information" description="Notes about this company.">
        <ModalTextarea
          label="Notes"
          icon="file"
          required
          placeholder="Notes"
          rows={3}
          value={form.notes}
          onChange={onChange("notes")}
        />
      </ModalSection>
    </>
  );
}

export function UserFormFields({ form, onChange, companies = [], mode = "create" }) {
  const editing = mode === "edit";
  const passwordKey = editing ? "password" : "passwordHash";

  return (
    <>
      <ModalSection icon="user" tone="green" title="Personal information" description="Contact details for this account.">
        <ModalGrid>
          <ModalInput label="Full name" icon="user" required placeholder="Full name" value={form.fullName} onChange={onChange("fullName")} />
          <ModalInput label="Email" icon="mail" type="email" required placeholder="Email" value={form.email} onChange={onChange("email")} />
          <ModalInput label="Phone" icon="phone" required placeholder="Phone" value={form.phone} onChange={onChange("phone")} />
        </ModalGrid>
      </ModalSection>

      <ModalSection icon="shield" tone="blue" title="Account access" description="Sign-in credentials, role and company assignment.">
        <ModalGrid>
          <ModalInput label="Username" icon="user" required placeholder="Username" value={form.username} onChange={onChange("username")} />
          <ModalPasswordInput
            label={editing ? "New password" : "Password"}
            required={!editing}
            placeholder={editing ? "Leave blank to keep" : "Password"}
            hint={editing ? "Leave blank to keep the current password." : undefined}
            value={form[passwordKey]}
            onChange={onChange(passwordKey)}
          />
          <ModalSelect label="Role" icon="shield" required value={form.role} onChange={onChange("role")}>
            <option value="supervisor">Supervisor</option>
            <option value="rm">Relationship Manager</option>
            <option value="client">Client</option>
          </ModalSelect>
          <ModalSelect
            label="Company"
            icon="building"
            required={!editing || form.role !== "superadmin"}
            value={form.companyId}
            onChange={onChange("companyId")}
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>{company.name}</option>
            ))}
          </ModalSelect>
        </ModalGrid>
      </ModalSection>
    </>
  );
}

export function AddCompanyModal({ form, onChange, onSubmit, onClose, canSubmit = true }) {
  return (
    <ModalShell
      as="form"
      wrapperProps={{ onSubmit }}
      icon="building"
      title="Add Company"
      subtitle="Create a company and set up its contact, address and branding."
      size="lg"
      onClose={onClose}
      dismissOnOverlay={false}
      closeLogTitle="Closed Add Company form"
      footer={(
        <>
          <ModalButton onClick={onClose} data-log-title="Cancelled Add Company form">Cancel</ModalButton>
          <ModalButton variant="primary" icon="save" type="submit" disabled={!canSubmit} data-log-title="Save new company">Save</ModalButton>
        </>
      )}
    >
      <CompanyFormFields form={form} onChange={onChange} />
    </ModalShell>
  );
}

export function AddUserModal({ form, onChange, companies = [], onSubmit, onClose, canSubmit = true }) {
  return (
    <ModalShell
      as="form"
      wrapperProps={{ onSubmit }}
      icon="userPlus"
      title="Add User"
      subtitle="Create an account and choose its role and company."
      size="lg"
      onClose={onClose}
      dismissOnOverlay={false}
      closeLogTitle="Closed Add User form"
      footer={(
        <>
          <ModalButton onClick={onClose} data-log-title="Cancelled Add User form">Cancel</ModalButton>
          <ModalButton variant="primary" icon="save" type="submit" disabled={!canSubmit} data-log-title="Save new user">Save</ModalButton>
        </>
      )}
    >
      <UserFormFields form={form} onChange={onChange} companies={companies} />
    </ModalShell>
  );
}
