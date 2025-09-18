import "../styles/loginform.css";
import BackButtonLogin from "./backbuttonlogin";
import Link from "next/link";

export default function ChangePasswordForm({ onBackClick }) {
  return (
    <>
      <div className="loginform-section">
        <form className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="form-input"
            />
          </div>
          <span className="error-message"></span>
          <div className="form-group">
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              className="form-input"
            />
          </div>
          <span className="error-message"></span>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="form-input"
            />
          </div>
          <span className="error-message"></span>
          <Link href="/login" type="submit" className="login-btn">
            Change Password
          </Link>
        </form>
      </div>
      <BackButtonLogin onBackClick={onBackClick} />
    </>
  );
}
