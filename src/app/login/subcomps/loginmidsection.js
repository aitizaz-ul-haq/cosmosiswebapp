import MidSectionLeftPart from "./microcomps/midsectionleftpart";
import MidSectionRightPart from "./microcomps/midsectionrightpart";

export default function LoginMidSection({
  loginformtitle,
  loginleftsideimagedata,
  forgotpasswordtitle,
}) {
  return (
    <div className="login-midsection">
      <MidSectionLeftPart loginleftsideimagedata={loginleftsideimagedata} />
      <MidSectionRightPart
        loginformtitle={loginformtitle}
        forgotpasswordtitle={forgotpasswordtitle}
      />
    </div>
  );
}
