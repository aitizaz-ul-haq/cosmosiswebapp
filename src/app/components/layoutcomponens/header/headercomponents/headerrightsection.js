import HeaderRightSectionButtonSection from "./headerrightsectionbuttongroup";
import HeaderContactButton from "./headercontactbutton";
import HeaderContactButtonTwo from "./headercontactbuttontwo";

export default function HeaderRightSection() {
  return (
    <div className="header-right-buttongroupsection">
      <HeaderRightSectionButtonSection />
      <div className="right-header-login-button-container">
        <HeaderContactButton name="Request a Demo" />
        <HeaderContactButtonTwo name="Login" />
      </div>
    </div>
  );
}
