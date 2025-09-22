import Image from "next/image";

import "./styles/notifs.css";

export default function SuccessLoginNotifs() {
  return (
    <div className="successnotif-container">
      <div className="success-icon-container">
        <Image
          src="/images/mark.png"
          width="64"
          height="64"
          alt="success_notif"
          className="notif-icon"
        />
      </div>
      <div className="successnotif-text-conatiner">
        <h4 className="successnotif-heading">Login Success!</h4>
        <div className="successnotif-description">
          Login successfull welcome to your cosmosis dashboard
        </div>
      </div>
    </div>
  );
}
