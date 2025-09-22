"use client";
import { useState } from "react";

import MidSectionLoginFormTopHeading from "./midsectionloginformtopheading";
import MidSectionLoginFormSection from "./midsectionloginformsection";
import MidSectionLoginFormSectionBottomLine from "./midsectionloginformbottomline";
import ChangePasswordForm from "../changepasswordform";
import Loader from "./loader";

// 🔹 Import toasts here
import SuccessLoginNotifs from "../notifs/successloginnotif";
import FailureLoginNotifs from "../notifs/failureloginnotifs";
import InfoLoginNotifs from "../notifs/infologinnotifs";

export default function MidSectionRightPart({
  loginformtitle,
  forgotpasswordtitle,
}) {
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Centralized toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [showInfoToast, setShowInfoToast] = useState(false);

  return (
    <div className="midsection-rightpart">
      {/* ✅ Toasts always render independently of loader/form */}
      {showSuccessToast && <SuccessLoginNotifs />}
      {showFailureToast && <FailureLoginNotifs />}
      {showInfoToast && <InfoLoginNotifs />}

      <div className="midsection-rightpart-loginform-container">
        {loading ? (
          <div className="loader-overlay">
            <Loader size={80} color="#21CFB2" />
            <p>Loading...</p>
          </div>
        ) : !isForgot ? (
          <>
            <MidSectionLoginFormTopHeading formtitle={loginformtitle} />
            <MidSectionLoginFormSection
              setLoading={setLoading}
              setShowSuccessToast={setShowSuccessToast}
              setShowFailureToast={setShowFailureToast}
              setShowInfoToast={setShowInfoToast}
            />
            <MidSectionLoginFormSectionBottomLine
              onForgotClick={() => setIsForgot(true)}
            />
          </>
        ) : (
          <>
            <MidSectionLoginFormTopHeading formtitle={forgotpasswordtitle} />
            <ChangePasswordForm onBackClick={() => setIsForgot(false)} />
          </>
        )}
      </div>
    </div>
  );
}
