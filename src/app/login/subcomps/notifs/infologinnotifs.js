import LoginToast from "./logintoast";

export default function InfoLoginNotifs() {
  return (
    <LoginToast tone="info" title="Unable to login!">
      If you forgot your password, contact your supervisor or relations manager to change it.
    </LoginToast>
  );
}
