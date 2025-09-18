"use client";

import { useUser } from "../../../context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import "../../styles/loginform.css";

export default function MidSectionLoginFormSection() {
  const { login } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (login(username, password)) {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password ❌");
    }
  };

  return (
    <div className="loginform-section">
      <form className="login-form" onSubmit={handleSubmit}>
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

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-btn">
          Log In
        </button>
      </form>
    </div>
  );
}
