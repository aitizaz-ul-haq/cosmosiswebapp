"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import "./styles/profilepage.css";

export default function ProfilePage() {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompanyEditModal, setShowCompanyEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [companyEditForm, setCompanyEditForm] = useState({
    name: "",
    legalName: "",
    website: "",
    registrationNumber: "",
    taxId: "",
    primaryContact: { fullName: "", email: "", phone: "" },
    address: {
      line1: "",
      line2: "",
      city: "",
      stateOrProvince: "",
      postalCode: "",
      country: "",
    },
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editMessage, setEditMessage] = useState({ type: "", text: "" });
  const [companyEditMessage, setCompanyEditMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch full user details
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserDetails(data.user);
        setEditForm({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
        });

        // Fetch company details if user has companyId (supervisor/rm)
        if (data.user.companyId && (data.user.role === "supervisor" || data.user.role === "rm")) {
          fetchCompanyDetails(data.user.companyId);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyDetails = async (companyId) => {
    try {
      const res = await fetch(`/api/companies?id=${companyId}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.company) {
        setCompanyDetails(data.company);
        setCompanyEditForm({
          name: data.company.name || "",
          legalName: data.company.legalName || "",
          website: data.company.website || "",
          registrationNumber: data.company.registrationNumber || "",
          taxId: data.company.taxId || "",
          primaryContact: {
            fullName: data.company.primaryContact?.fullName || "",
            email: data.company.primaryContact?.email || "",
            phone: data.company.primaryContact?.phone || "",
          },
          address: {
            line1: data.company.address?.line1 || "",
            line2: data.company.address?.line2 || "",
            city: data.company.address?.city || "",
            stateOrProvince: data.company.address?.stateOrProvince || "",
            postalCode: data.company.address?.postalCode || "",
            country: data.company.address?.country || "",
          },
        });
      }
    } catch (err) {
      console.error("Failed to fetch company details:", err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditMessage({ type: "", text: "" });
  };

  const handleCompanyEditFormChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setCompanyEditForm((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else {
      setCompanyEditForm((prev) => ({ ...prev, [name]: value }));
    }
    setCompanyEditMessage({ type: "", text: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditMessage({ type: "", text: "" });
    setSubmitting(true);

    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok) {
        setEditMessage({ type: "success", text: "Profile updated successfully" });
        setUserDetails(data.user);
        setTimeout(() => {
          setShowEditModal(false);
          setEditMessage({ type: "", text: "" });
        }, 1500);
      } else {
        setEditMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setEditMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompanyEditSubmit = async (e) => {
    e.preventDefault();
    setCompanyEditMessage({ type: "", text: "" });
    setSubmitting(true);

    try {
      const res = await fetch(`/api/companies?id=${companyDetails._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(companyEditForm),
      });

      const data = await res.json();

      if (res.ok) {
        setCompanyEditMessage({ type: "success", text: "Company information updated successfully" });
        setCompanyDetails(data.company);
        setTimeout(() => {
          setShowCompanyEditModal(false);
          setCompanyEditMessage({ type: "", text: "" });
        }, 1500);
      } else {
        setCompanyEditMessage({ type: "error", text: data.error || "Failed to update company information" });
      }
    } catch (err) {
      console.error("Company update error:", err);
      setCompanyEditMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage({ type: "", text: "" });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordErrors({ currentPassword: "", newPassword: "" });
    setMessage({ type: "", text: "" });

    // Validation
    let hasError = false;
    const errors = { currentPassword: "", newPassword: "" };

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
      hasError = true;
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
      hasError = true;
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
      hasError = true;
    } else if (passwordForm.currentPassword && passwordForm.newPassword === passwordForm.currentPassword) {
      errors.newPassword = "New password must be different from current password";
      hasError = true;
    }

    if (hasError) {
      setPasswordErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/me/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully" });
        setPasswordForm({ currentPassword: "", newPassword: "" });
        setPasswordErrors({ currentPassword: "", newPassword: "" });
      } else {
        // Handle specific error messages from API
        if (data.error === "Current password is incorrect") {
          setPasswordErrors((prev) => ({ ...prev, currentPassword: data.error }));
        } else if (data.error === "New password must be different from current password") {
          setPasswordErrors((prev) => ({ ...prev, newPassword: data.error }));
        } else {
          setMessage({ type: "error", text: data.error || "Failed to change password" });
        }
      }
    } catch (err) {
      console.error("Password change error:", err);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
      </div>
    );
  }

  if (!userDetails) {
    return <div className="profile-page-container">Failed to load profile information</div>;
  }

  // Format role for display
  const formatRole = (role) => {
    const roleMap = {
      superadmin: "Super Admin",
      supervisor: "Supervisor",
      rm: "Relationship Manager",
      client: "Client",
    };
    return roleMap[role] || role;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isSupervisorOrRm =
    userDetails.role === "supervisor" || userDetails.role === "rm";

  return (
    <div className="profile-page-container">
      {/* Header */}
      <div className="profile-overview-header">
        <h1 className="profile-overview-title">Profile Overview</h1>
        <p className="profile-overview-subtitle">
          Review and manage your personal details, account information, and
          security settings from one place.
        </p>
      </div>

      {/* Stat cards */}
      <div className="profile-stats">
        <div className="profile-stat-card">
          <div className="profile-stat-icon">
            <ShieldIcon />
          </div>
          <div className="profile-stat-body">
            <span className="profile-stat-label">Account Status</span>
            <span className="profile-stat-value">
              {userDetails.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-icon">
            <UserIcon />
          </div>
          <div className="profile-stat-body">
            <span className="profile-stat-label">Role</span>
            <span className="profile-stat-value">{formatRole(userDetails.role)}</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-icon">
            <BuildingIcon />
          </div>
          <div className="profile-stat-body">
            <span className="profile-stat-label">Company</span>
            <span className="profile-stat-value">
              {userDetails.companyName || "—"}
            </span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-icon">
            <CalendarIcon />
          </div>
          <div className="profile-stat-body">
            <span className="profile-stat-label">Member Since</span>
            <span className="profile-stat-value">
              {formatDate(userDetails.createdAt) || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Company Information card - Only for Supervisors and RMs */}
      {isSupervisorOrRm && companyDetails && (
        <div className="profile-card">
          <div className="profile-card-header">
            <span className="profile-card-icon">
              <BuildingIcon />
            </span>
            <h2 className="profile-card-title">Company Information</h2>
          </div>

          <div className="profile-card-grid">
            <div className="profile-card-col">
              <InfoRow label="Company Name" value={companyDetails.name} />
              <InfoRow label="Legal Name" value={companyDetails.legalName} />
              <InfoRow label="Website" value={companyDetails.website} />
              <InfoRow label="Registration No." value={companyDetails.registrationNumber} />
            </div>
            <div className="profile-card-col">
              <InfoRow label="Tax ID" value={companyDetails.taxId} />
              <InfoRow label="Status" value={companyDetails.status} />
              {companyDetails.primaryContact?.fullName && (
                <InfoRow label="Contact Name" value={companyDetails.primaryContact.fullName} />
              )}
              {companyDetails.primaryContact?.email && (
                <InfoRow label="Contact Email" value={companyDetails.primaryContact.email} />
              )}
            </div>
          </div>

          <div className="profile-card-footer">
            <button
              className="profile-primary-btn profile-primary-btn-wide"
              onClick={() => setShowCompanyEditModal(true)}
            >
              <EditIcon />
              Edit Info
            </button>
          </div>
        </div>
      )}

      {/* Personal Information card */}
      <div className="profile-card">
        <div className="profile-card-header">
          <span className="profile-card-icon">
            <UserIcon />
          </span>
          <h2 className="profile-card-title">Personal Information</h2>
        </div>

        <div className="profile-card-grid">
          <div className="profile-card-col">
            <InfoRow label="Username" value={userDetails.username} />
            <InfoRow label="Full Name" value={userDetails.fullName} />
            <InfoRow label="Phone" value={userDetails.phone} />
            <InfoRow label="Company" value={userDetails.companyName || "—"} />
          </div>
          <div className="profile-card-col">
            <InfoRow label="Role" value={formatRole(userDetails.role)} />
            <InfoRow label="Email" value={userDetails.email} />
            <InfoRow
              label="Status"
              value={userDetails.isActive ? "Active" : "Inactive"}
            />
            <InfoRow
              label="Account Created"
              value={formatDate(userDetails.createdAt) || "—"}
            />
          </div>
        </div>

        <div className="profile-card-footer">
          <button
            className="profile-primary-btn profile-primary-btn-wide"
            onClick={() => setShowEditModal(true)}
          >
            <EditIcon />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Security Settings card */}
      <div className="profile-card">
        <div className="profile-card-header">
          <span className="profile-card-icon">
            <LockIcon />
          </span>
          <div>
            <h2 className="profile-card-title">Security Settings</h2>
            <p className="profile-card-subtitle">
              Update your password to help keep your account secure.
            </p>
          </div>
        </div>

        <form className="profile-security-form" onSubmit={handlePasswordSubmit}>
          <div className="profile-security-grid">
            <div className="profile-form-group">
              <label htmlFor="currentPassword" className="profile-form-label">
                Current Password
              </label>
              <div className="profile-password-input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={`profile-form-input ${passwordErrors.currentPassword ? "error" : ""}`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  className="profile-password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <span className="profile-field-error">{passwordErrors.currentPassword}</span>
              )}
            </div>

            <div className="profile-form-group">
              <label htmlFor="newPassword" className="profile-form-label">
                New Password
              </label>
              <div className="profile-password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className={`profile-form-input ${passwordErrors.newPassword ? "error" : ""}`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="profile-password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <span className="profile-field-error">{passwordErrors.newPassword}</span>
              )}
            </div>
          </div>

          <div className="profile-security-footer">
            <button type="submit" className="profile-primary-btn" disabled={submitting}>
              <LockIcon />
              {submitting ? "Changing Password..." : "Change Password"}
            </button>
            <div className="profile-security-info">
              <InfoBadgeIcon />
              <span>Use a strong password and keep your login credentials secure.</span>
            </div>
          </div>

          {message.text && (
            <div className={`profile-message ${message.type}`}>{message.text}</div>
          )}
        </form>
      </div>

      {/* Edit Info Modal */}
      {showEditModal && (
        <div className="profile-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Edit Personal Information</h3>
              <button
                className="profile-modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <form className="profile-modal-form" onSubmit={handleEditSubmit}>
              <div className="profile-form-group">
                <label htmlFor="editFullName" className="profile-form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="editFullName"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleEditFormChange}
                  className="profile-form-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="editEmail" className="profile-form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  className="profile-form-input"
                  placeholder="Enter your email"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="editPhone" className="profile-form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="editPhone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditFormChange}
                  className="profile-form-input"
                  placeholder="Enter your phone number"
                />
              </div>

              {editMessage.text && (
                <div className={`profile-message ${editMessage.type}`}>{editMessage.text}</div>
              )}

              <div className="profile-modal-actions">
                <button
                  type="button"
                  className="profile-modal-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Info Modal - Only for Supervisors and RMs */}
      {showCompanyEditModal && companyDetails && (
        <div className="profile-modal-overlay" onClick={() => setShowCompanyEditModal(false)}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Edit Company Information</h3>
              <button
                className="profile-modal-close"
                onClick={() => setShowCompanyEditModal(false)}
              >
                ×
              </button>
            </div>

            <form className="profile-modal-form" onSubmit={handleCompanyEditSubmit}>
              <div className="profile-form-group">
                <label htmlFor="companyName" className="profile-form-label">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="name"
                  value={companyEditForm.name}
                  onChange={handleCompanyEditFormChange}
                  className="profile-form-input"
                  placeholder="Enter company name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="legalName" className="profile-form-label">
                  Legal Name
                </label>
                <input
                  type="text"
                  id="legalName"
                  name="legalName"
                  value={companyEditForm.legalName}
                  onChange={handleCompanyEditFormChange}
                  className="profile-form-input"
                  placeholder="Enter legal name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="website" className="profile-form-label">
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={companyEditForm.website}
                  onChange={handleCompanyEditFormChange}
                  className="profile-form-input"
                  placeholder="Enter website URL"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="registrationNumber" className="profile-form-label">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={companyEditForm.registrationNumber}
                  onChange={handleCompanyEditFormChange}
                  className="profile-form-input"
                  placeholder="Enter registration number"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="taxId" className="profile-form-label">
                  Tax ID
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={companyEditForm.taxId}
                  onChange={handleCompanyEditFormChange}
                  className="profile-form-input"
                  placeholder="Enter tax ID"
                />
              </div>

              {companyEditMessage.text && (
                <div className={`profile-message ${companyEditMessage.type}`}>{companyEditMessage.text}</div>
              )}

              <div className="profile-modal-actions">
                <button
                  type="button"
                  className="profile-modal-cancel"
                  onClick={() => setShowCompanyEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small presentational helpers ---------- */

function InfoRow({ label, value }) {
  return (
    <div className="profile-info-item">
      <span className="profile-info-label">{label}:</span>
      <span className="profile-info-value">{value || "—"}</span>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
      <path d="M10 21v-3h4v3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function InfoBadgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );
}
