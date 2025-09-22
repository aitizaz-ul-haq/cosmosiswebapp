import Image from "next/image";

import "./styles/notifs.css";

export default function FailureLoginNotifs() {
  return (
    <div className="failurenotif-container">
      <div className="failure-icon-container">
        <Image
          src="/images/close.png"
          width="64"
          height="64"
          alt="failure_notif"
          className="notif-icon"
        />
      </div>
      <div className="failurenotif-text-conatiner">
        <h4 className="failurenotif-heading">Login Failed!</h4>
        <div className="failurenotif-description">
          Login failed please try again with correct username/password
        </div>
      </div>
    </div>
  );
}
