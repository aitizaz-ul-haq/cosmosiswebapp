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

  return (
    <div className="profile-page-container">
      {/* Company Information Section - Only for Supervisors and RMs */}
      {(userDetails.role === "supervisor" || userDetails.role === "rm") && companyDetails && (
        <>
          <div className="profile-section-header">
            <h2 className="profile-section-title">Company Information</h2>
            <p className="profile-section-description">View and edit your company information</p>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Company Name:</span>
              <span className="profile-info-value">{companyDetails.name}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Legal Name:</span>
              <span className="profile-info-value">{companyDetails.legalName}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Website:</span>
              <span className="profile-info-value">{companyDetails.website}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Registration Number:</span>
              <span className="profile-info-value">{companyDetails.registrationNumber}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Tax ID:</span>
              <span className="profile-info-value">{companyDetails.taxId}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Status:</span>
              <span className="profile-info-value">{companyDetails.status}</span>
            </div>
            {companyDetails.primaryContact?.fullName && (
              <>
                <div className="profile-info-item">
                  <span className="profile-info-label">Contact Name:</span>
                  <span className="profile-info-value">{companyDetails.primaryContact.fullName}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Contact Email:</span>
                  <span className="profile-info-value">{companyDetails.primaryContact.email}</span>
                </div>
              </>
            )}
          </div>

          <button className="profile-edit-button" onClick={() => setShowCompanyEditModal(true)}>
            Edit Info
          </button>

          {/* Divider */}
          <hr className="profile-divider" />
        </>
      )}

      {/* Personal Information Section */}
      <div className="profile-section-header">
        <h2 className="profile-section-title">Personal Information</h2>
        <p className="profile-section-description">View and edit your profile information</p>
      </div>

      <div className="profile-info-grid">
        <div className="profile-info-item">
          <span className="profile-info-label">Username:</span>
          <span className="profile-info-value">{userDetails.username}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">Role:</span>
          <span className="profile-info-value">{formatRole(userDetails.role)}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">Full Name:</span>
          <span className="profile-info-value">{userDetails.fullName}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">Email:</span>
          <span className="profile-info-value">{userDetails.email}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">Phone:</span>
          <span className="profile-info-value">{userDetails.phone}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">Status:</span>
          <span className="profile-info-value">{userDetails.isActive ? "Active" : "Inactive"}</span>
        </div>
        {userDetails.companyName && (
          <div className="profile-info-item">
            <span className="profile-info-label">Company:</span>
            <span className="profile-info-value">{userDetails.companyName}</span>
          </div>
        )}
        {userDetails.createdAt && (
          <div className="profile-info-item">
            <span className="profile-info-label">Account Created:</span>
            <span className="profile-info-value">{formatDate(userDetails.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Edit Info Button */}
      <button className="profile-edit-button" onClick={() => setShowEditModal(true)}>
        Edit Info
      </button>

      {/* Divider */}
      <hr className="profile-divider" />

      {/* Profile Settings Section */}
      <div className="profile-section-header">
        <h2 className="profile-section-title">Profile Settings</h2>
        <p className="profile-section-description">Modify your profile settings</p>
      </div>

      <form className="profile-settings-form" onSubmit={handlePasswordSubmit}>
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
              className={`profile-form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              className="profile-password-toggle"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
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
              className={`profile-form-input ${passwordErrors.newPassword ? 'error' : ''}`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="profile-password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {passwordErrors.newPassword && (
            <span className="profile-field-error">{passwordErrors.newPassword}</span>
          )}
        </div>

        <button type="submit" className="profile-form-button" disabled={submitting}>
          {submitting ? "Changing Password..." : "Change Password"}
        </button>

        {message.text && (
          <div className={`profile-message ${message.type}`}>{message.text}</div>
        )}
      </form>

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