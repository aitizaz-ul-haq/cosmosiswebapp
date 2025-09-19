"use client";
import { useState } from "react";

import MidSectionLoginFormTopHeading from "./midsectionloginformtopheading";
import MidSectionLoginFormSection from "./midsectionloginformsection";
import MidSectionLoginFormSectionBottomLine from "./midsectionloginformbottomline";
import ChangePasswordForm from "../changepasswordform";
import Loader from "./loader"; // ✅ import loader

export default function MidSectionRightPart({
  loginformtitle,
  forgotpasswordtitle,
}) {
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loader state

  return (
    <div className="midsection-rightpart">
      <div className="midsection-rightpart-loginform-container">
        {loading ? (
          // ✅ Loader fully replaces form
          <div className="loader-overlay">
            <Loader size={80} color="#21CFB2;" />
            <p>Loading...</p>
          </div>
        ) : !isForgot ? (
          <>
            <MidSectionLoginFormTopHeading formtitle={loginformtitle} />
            <MidSectionLoginFormSection setLoading={setLoading} />
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
