import LoginToast from "./logintoast";

export default function FailureLoginNotifs() {
  return (
    <LoginToast tone="warning" title="Login Failed!">
      Login failed, please try again with the correct username and password.
    </LoginToast>
  );
}
