import LoginToast from "./logintoast";

export default function InfoLoginNotifs() {
  return (
    <LoginToast tone="info" title="Unable to login!">
      If you forgot your password, contact your Compliance Officer or Investment Manager to change it.
    </LoginToast>
  );
}
