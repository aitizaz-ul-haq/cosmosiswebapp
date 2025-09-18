import HeaderMobileMenuRightSection from "./headermobilemenurightsection";
import HeaderLeftSection from "./headerleftsection";

// export default function MobileHeader({ isScrolled }) {
//   return (
//     <div
//       className={`header-mobile-container ${
//         isScrolled ? "mobile-header-scrolled" : ""
//       }`}
//     >
//       <div className="mobile-header-section-top">
//         <HeaderLeftSection />
//         <HeaderMobileMenuRightSection />
//       </div>

//       <div className="herosection-heading-main-container">
//         <h1 className="herosection-heading-main">
//           Bringing Celestial Order to the Client Onboarding Experience
//         </h1>
//       </div>
//     </div>
//   );
// }

export default function MobileHeader({ isScrolled }) {
  return (
    <div className={`header-mobile-container ${isScrolled ? "scrolled" : ""}`}>
      <div className="mobile-header-section-top">
        <HeaderLeftSection />
        <HeaderMobileMenuRightSection />
      </div>

      <div className="herosection-heading-main-container">
        <h1 className="herosection-heading-main">
          Bringing Celestial Order to the Client Onboarding Experience
        </h1>
      </div>
    </div>
  );
}
