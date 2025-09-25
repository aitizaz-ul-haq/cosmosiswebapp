"use client";

import { useState } from "react";

export default function EightSectionContactForm() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/request-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send request");

      setSuccess(true);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        message: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contactformsection-bottom-form-section">
      <div className="contactformsection-bottom-form">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group first-name">
              <label htmlFor="firstname" className="form-label ">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="form-input"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group last-name">
              <label htmlFor="lastname" className="form-label ">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className="form-input"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group email">
              <label htmlFor="email" className="form-label ">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group phone">
              <label htmlFor="phone" className="form-label ">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group company">
              <label htmlFor="company" className="form-label ">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-input"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group role full-width">
              <label htmlFor="role" className="form-label">
                Job Title / Role
              </label>
              <select
                id="role"
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select a role</option>
                <option value="supervisor">Supervisor</option>
                <option value="rm">Relationship Manager</option>
                <option value="client">Client</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group message full-width">
              <label htmlFor="message" className="form-label ">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="form-textarea"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-row button-row">
            <button type="submit" className="form-submit-button" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>

          {success && <p className="success-msg">✅ Request sent successfully!</p>}
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
  );
}
