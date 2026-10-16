export default function LoginBottomSection({ termsofuse, privacypolicy }) {
  return (
    <footer className="login-bottomsection">
      <span className="login-footer-link">{termsofuse}</span>
      <span className="login-footer-divider" aria-hidden="true" />
      <span className="login-footer-link">{privacypolicy}</span>
    </footer>
  );
}
