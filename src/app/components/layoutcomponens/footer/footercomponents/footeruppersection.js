import FooterUpperSectionLeftSection from "./footeruppersectioncomps/footeruppersectionleftsection";
import FooerUpperSectionRightSection from "./footeruppersectioncomps/footeruppersectionrightsection";

export default function FooterUpperSection() {
  return (
    <div className="footer-uppersection">
      <FooterUpperSectionLeftSection />
      <div className="footer-leftsection-line"></div>
      <FooerUpperSectionRightSection />
    </div>
  );
}
