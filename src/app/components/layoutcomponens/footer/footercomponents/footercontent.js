import FooterUpperSection from "./footeruppersection";
import FooterMiddleSection from "./footermiddlesection";
import FooterBottomSection from "./footerbottomsection";
import FooterRightsSection from "./footerrightssection";

export default function FooterContent() {
  return (
    <div className="footer-content-container">
      <FooterUpperSection />
      <FooterMiddleSection />
      <FooterBottomSection />
      <FooterRightsSection />
    </div>
  );
}
