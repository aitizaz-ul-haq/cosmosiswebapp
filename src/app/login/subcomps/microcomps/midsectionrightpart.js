"use client";
import { useState } from "react";

import MidSectionLoginFormTopHeading from "./midsectionloginformtopheading";
import MidSectionLoginFormSection from "./midsectionloginformsection";
import Loader from "./loader";

// 🔹 Import toasts here
import SuccessLoginNotifs from "../notifs/successloginnotif";
import FailureLoginNotifs from "../notifs/failureloginnotifs";
import InfoLoginNotifs from "../notifs/infologinnotifs";

export default function MidSectionRightPart({ loginformtitle, loginformsubtitle }) {
  const [loading, setLoading] = useState(false);

  // 🔹 Centralized toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [showInfoToast, setShowInfoToast] = useState(false);

  return (
    <>
      {/* Toasts are fixed to the screen, so they live outside the glass card
          (its backdrop-filter would otherwise make it their containing block) */}
      <div className="login-toasts">
        {showSuccessToast && <SuccessLoginNotifs />}
        {showFailureToast && <FailureLoginNotifs />}
        {showInfoToast && <InfoLoginNotifs />}
      </div>

      <div className="midsection-rightpart">
        <div className="midsection-rightpart-loginform-container">
          {loading ? (
            <div className="loader-overlay">
              <Loader size={80} color="#21CFB2" />
              <p>Loading...</p>
            </div>
          ) : (
            <>
              <MidSectionLoginFormTopHeading
                formtitle={loginformtitle}
                formsubtitle={loginformsubtitle}
              />
              <MidSectionLoginFormSection
                setLoading={setLoading}
                setShowSuccessToast={setShowSuccessToast}
                setShowFailureToast={setShowFailureToast}
                setShowInfoToast={setShowInfoToast}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
