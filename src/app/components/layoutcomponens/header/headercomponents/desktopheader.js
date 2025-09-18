import HeaderLeftSection from "./headerleftsection";
import HeaderRightSection from "./headerrightsection";
// import HeaderContactButton from "./headercontactbutton";

export default function DesktopHeader({ isScrolled }) {
  return (
    <>
      <div className={`header-main-container ${isScrolled ? "scrolled" : ""}`}>
        <div className="menu-section">
          <HeaderLeftSection />
          <HeaderRightSection />
        </div>
        <div className="herosection-heading-main-container">
          <h1 className="herosection-heading-main">Bringing Celestial Order to the Client Onboarding Experience</h1>
        </div>
      </div>
    </>
  );
}
