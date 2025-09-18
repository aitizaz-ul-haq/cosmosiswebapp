import TopSectionTextContainer from "./microcomps/topsectiontextcontainer";

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
    </div>
  );
}
