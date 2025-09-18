import FooterSocialItemOne from "./socialrowlistitemcomps/footersocialitemone";
import FooterSocialItemTwo from "./socialrowlistitemcomps/footersocialitemtwo";
import FooterSocialItemThree from "./socialrowlistitemcomps/footersocialitemthree";
import FooterSocialItemFour from "./socialrowlistitemcomps/footersocialitemfour";

export default function FooterBottomSectionSocialsRow() {
  return (
    <div className="footer-bottomsection-socials-row">
      <ul className="footer-socialrow">
        <FooterSocialItemOne />
        <FooterSocialItemTwo />
        <FooterSocialItemThree />
        <FooterSocialItemFour />
      </ul>
    </div>
  );
}
