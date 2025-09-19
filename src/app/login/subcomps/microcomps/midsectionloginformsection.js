"use client";

import { useUser } from "../../../context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logUIAction } from "@/lib/logUIAction";

import "../../styles/loginform.css";

export default function MidSectionLoginFormSection({ setLoading }) {
  const { login } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pendingError, setPendingError] = useState(""); 

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setPendingError(""); 
    setLoading(true); // show loader immediately
    const startTime = Date.now();

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    const loggedInUser = await login(username, password);

    const elapsed = Date.now() - startTime;
    const minDuration = 3000; // 3 seconds

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

      setTimeout(() => {
        router.push("/dashboard");
      }, Math.max(0, minDuration - elapsed));
    } else {
      // ❌ Wrong credentials
      await logUIAction("login_failed", { username });
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login_failed",
          metadata: { username },
        }),
        credentials: "include",
      });

     

      setTimeout(() => {
        setLoading(false); 
        setError(pendingError || "Invalid username or password ❌");
      }, Math.max(0, minDuration - elapsed));

       // 🔹 Store the error immediately, show it once loader hides
      setPendingError("Invalid username or password ❌");
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
