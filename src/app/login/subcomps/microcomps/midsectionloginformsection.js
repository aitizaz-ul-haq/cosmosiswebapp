"use client";

import { useUser } from "../../../context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logUIAction } from "@/lib/logUIAction";

import SuccessLoginNotifs from "../notifs/successloginnotif";
import FailureLoginNotifs from "../notifs/failureloginnotifs";
import InfoLoginNotifs from "../notifs/infologinnotifs";

import "../../styles/loginform.css";

export default function MidSectionLoginFormSection({
  setLoading,
  setShowSuccessToast,
  setShowFailureToast,
  setShowInfoToast,
  showSuccessToast,
  showFailureToast,
  showInfoToast,
}) {
  const { login } = useUser();
  const router = useRouter();

  const [error, setError] = useState("");
  const [pendingError, setPendingError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPendingError("");
    setLoading(true);
    const startTime = Date.now();

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    const loggedInUser = await login(username, password);

    const elapsed = Date.now() - startTime;
    const minDuration = 3000;

    if (loggedInUser) {
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

      setShowSuccessToast(true);

      setTimeout(() => {
        setShowSuccessToast(false);
        router.push("/dashboard");
      }, Math.max(0, minDuration - elapsed));
    } else {
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

      setShowFailureToast(true);
      setShowInfoToast(true);

      setTimeout(() => {
        setLoading(false);
        setError(pendingError || "Invalid username or password ❌");

        setTimeout(() => {
          setShowFailureToast(false);
          setShowInfoToast(false);
        }, 3000); // auto hide after 3s
      }, Math.max(0, minDuration - elapsed));

      setPendingError("Invalid username or password ❌");
    }
  };

  return (
    <div className="loginform-section">
     {/* ✅ Toasts only render if flags are true */}
      {showSuccessToast && <SuccessLoginNotifs />}
      {showFailureToast && <FailureLoginNotifs />}
      {showInfoToast && <InfoLoginNotifs />}

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
