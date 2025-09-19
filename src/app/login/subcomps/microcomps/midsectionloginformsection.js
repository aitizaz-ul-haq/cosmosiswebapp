"use client";

import { useUser } from "../../../context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logUIAction } from "@/lib/logUIAction";

import "../../styles/loginform.css";

export default function MidSectionLoginFormSection() {
  const { login } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    const loggedInUser = await login(username, password);

    if (loggedInUser) {
      // ✅ Log successful login
      await logUIAction("login_success", { username });
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login_success",
          metadata: { username },
        }),
        credentials: "include",
      });

      router.push("/dashboard");
    } else {
      setError("Invalid username or password ❌");
      await logUIAction("login_failed", { username });

      // ❌ Log failed login attempt
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login_failed",
          metadata: { username },
        }),
        credentials: "include",
      });
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
