"use client";
import { useState } from "react";

import MidSectionLoginFormTopHeading from "./midsectionloginformtopheading";
import MidSectionLoginFormSection from "./midsectionloginformsection";
import MidSectionLoginFormSectionBottomLine from "./midsectionloginformbottomline";
import ChangePasswordForm from "../changepasswordform";

export default function MidSectionRightPart({
  loginformtitle,
  forgotpasswordtitle,
}) {
  const [isForgot, setIsForgot] = useState(false);

  return (
    <div className="midsection-rightpart">
      <div className="midsection-rightpart-loginform-container">
        {!isForgot ? (
          <>
            <MidSectionLoginFormTopHeading formtitle={loginformtitle} />
            <MidSectionLoginFormSection />
            <MidSectionLoginFormSectionBottomLine
              onForgotClick={() => setIsForgot(true)}
            />
          </>
        ) : (
          <>
            <MidSectionLoginFormTopHeading
              formtitle={forgotpasswordtitle}
            />
            <ChangePasswordForm onBackClick={() => setIsForgot(false)} />
          </>
        )}
      </div>
    </div>
  );
}
