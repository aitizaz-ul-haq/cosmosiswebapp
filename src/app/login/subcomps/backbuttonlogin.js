export default function BackButtonLogin({ onBackClick }) {
  return (
    <div className="login-forgot-section">
      <button
        type="button"
        className="backbutton font-playfair"
        onClick={onBackClick}
        title="go back"
      >
        Back
      </button>
    </div>
  );
}
