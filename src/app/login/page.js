import "./styles/login.css";

import loginformdata from "../data/loginpagedata/loginpagedata.json";
import LoginHero from "./subcomps/microcomps/loginhero";
import MidSectionRightPart from "./subcomps/microcomps/midsectionrightpart";
import LoginBottomSection from "./subcomps/loginbottomsection";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-stage">
        <LoginHero
          title={loginformdata.loginpagetile}
          description={loginformdata.loginpagedescription}
          logo={loginformdata.logoleftsideimage}
          features={loginformdata.features}
        />
        <MidSectionRightPart
          loginformtitle={loginformdata.loginformtitle}
          loginformsubtitle={loginformdata.loginformsubtitle}
        />
        <LoginBottomSection
          termsofuse={loginformdata.termsofuse}
          privacypolicy={loginformdata.privacypolicy}
        />
      </div>
    </div>
  );
}
