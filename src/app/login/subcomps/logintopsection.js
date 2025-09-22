import TopSectionTextContainer from "./microcomps/topsectiontextcontainer";

import SuccessLoginNotifs from "./notifs/successloginnotif";
import FailureLoginNotifs from "./notifs/failureloginnotifs";
import InfoLoginNotifs from "./notifs/infologinnotifs";

export default function LoginTopSection({
  loginpagetitle,
  loginpagedescription,
}) {
  return (
    <div className="login-topsection">
      <TopSectionTextContainer
        loginpagetitle={loginpagetitle}
        loginpagedescription={loginpagedescription}
      />
      {/* <div className="topsection-notification-conatiner">
        <FailureLoginNotifs />
        <SuccessLoginNotifs />
        <InfoLoginNotifs />
      </div> */}
    </div>
  );
}
