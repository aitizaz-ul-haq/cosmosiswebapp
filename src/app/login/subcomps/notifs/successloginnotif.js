import LoginToast from "./logintoast";

export default function SuccessLoginNotifs() {
  return (
    <LoginToast tone="success" title="Login Success!">
      Login successful, welcome to your Cosmosis dashboard.
    </LoginToast>
  );
}
