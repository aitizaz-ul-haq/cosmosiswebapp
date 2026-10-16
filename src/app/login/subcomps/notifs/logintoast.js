import LoginIcon from "../microcomps/loginicon";
import "./styles/notifs.css";

// One toast look for every login message: tinted card, dark outline, square icon tile.
// tone: success | warning | info
const ICONS = { success: "checkCircle", warning: "alert", info: "info" };

export default function LoginToast({ tone = "info", title, children }) {
  return (
    <div className={`login-toast toast-${tone}`} role="status">
      <span className="login-toast-icon" aria-hidden="true">
        <LoginIcon name={ICONS[tone]} size={22} strokeWidth={2} />
      </span>
      <div className="login-toast-text">
        <h4 className="login-toast-title">{title}</h4>
        <p className="login-toast-desc">{children}</p>
      </div>
    </div>
  );
}
