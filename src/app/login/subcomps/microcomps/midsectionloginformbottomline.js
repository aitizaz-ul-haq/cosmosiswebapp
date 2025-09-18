export default function MidSectionLoginFormSectionBottomLine({
  onForgotClick,
}) {
  return (
    <div className="login-forgot-section">
      <button
        type="button"
        className="backbutton"
        title="change your password"
        onClick={onForgotClick}
      >
        forgot password?
      </button>
    </div>
  );
}
