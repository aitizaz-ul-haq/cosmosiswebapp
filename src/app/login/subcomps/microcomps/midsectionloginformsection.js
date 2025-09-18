"use client";

import Link from "next/link";

import "../../styles/loginform.css";

export default function MidSectionLoginFormSection() {
  return (
    <div className="loginform-section">
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();

          const usernameInput = e.target.username;
          const passwordInput = e.target.password;

          let isValid = true;

          // Reset
          usernameInput.classList.remove("error");
          passwordInput.classList.remove("error");

          if (!usernameInput.value.trim()) {
            usernameInput.classList.add("error");
            usernameInput.nextElementSibling.textContent = "Field is empty";
            isValid = false;
          } else {
            usernameInput.nextElementSibling.textContent = "";
          }

          if (!passwordInput.value.trim()) {
            passwordInput.classList.add("error");
            passwordInput.nextElementSibling.textContent = "Field is empty";
            isValid = false;
          } else {
            passwordInput.nextElementSibling.textContent = "";
          }

          if (isValid) {
            alert("Form submitted successfully ✅");
            // handle login submission here
          }
        }}
      >
        <div className="form-group">
          <input
            type="text"
            name="username"
            className="form-input"
            placeholder="Username"
          />
          <span className="error-message"></span>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Password"
          />
          <span className="error-message"></span>
        </div>

        <Link href="/dashboard" type="submit" className="login-btn">
          Log In
        </Link>
      </form>
    </div>
  );
}
