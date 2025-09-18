import "./styles/login.css";

import loginformdata from "../data/loginpagedata/loginpagedata.json";
import LoginTopSection from "./subcomps/logintopsection";
import LoginMidSection from "./subcomps/loginmidsection";
import LoginBottomSection from "./subcomps/loginbottomsection";

let loginpagetitle = loginformdata.loginpagetile;
let loginpagedescription = loginformdata.loginpagedescription;
let loginformtitle = loginformdata.loginformtitle;
let loginleftsideimagedata = loginformdata.logoleftsideimage;
let termsogpolicy = loginformdata.termsofusepolicy;
let forgotpasswordtitle = loginformdata.forgotpasswordformtitle;

export default function Login() {
  return (
    <div className="login-container">
      <LoginTopSection
        loginpagetitle={loginpagetitle}
        loginpagedescription={loginpagedescription}
      />
      <LoginMidSection
        loginformtitle={loginformtitle}
        loginleftsideimagedata={loginleftsideimagedata}
        forgotpasswordtitle={forgotpasswordtitle}
      />
      <LoginBottomSection termsogpolicy={termsogpolicy} />
    </div>
  );
}
