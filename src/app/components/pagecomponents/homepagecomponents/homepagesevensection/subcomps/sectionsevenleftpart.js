import TrustedSectionTagContainer from "./trustedsectioncomps/trsutedsectiontagcontainer";
import TrustedSectionHeading from "./trustedsectioncomps/trustedsectionheading";
import TrustedSectionDescription from "./trustedsectioncomps/trustedsectiondescription";

export default function SectionSevenLeftPart({
  sevensectionlefttagtitle,
  sevensectionleftheading,
  sevensectionleftpara,
}) {
  return (
    <div className="sectionseven-left-part">
      <div className="sectionseven-trusted-section-container">
        <TrustedSectionTagContainer
          sevensectionlefttagtitle={sevensectionlefttagtitle}
        />
        <TrustedSectionHeading
          sevensectionleftheading={sevensectionleftheading}
        />
        <TrustedSectionDescription
          sevensectionleftpara={sevensectionleftpara}
        />
      </div>
    </div>
  );
}
