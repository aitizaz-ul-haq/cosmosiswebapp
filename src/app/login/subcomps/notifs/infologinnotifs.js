import Image from "next/image";

import "./styles/notifs.css";

export default function InfoLoginNotifs() {
  return (
    <div className="infonotif-container">
      <div className="info-icon-container">
        <Image
          src="/images/information.png"
          width="64"
          height="64"
          alt="info_notif"
          className="notif-icon"
        />
      </div>
      <div className="infonotif-text-conatiner">
        <h4 className="infonotif-heading">Unable to login!</h4>
        <div className="infonotif-description">
          If you forgot your password contact your supervisor or relations manager to change password
        </div>
      </div>
    </div>
  );
}
