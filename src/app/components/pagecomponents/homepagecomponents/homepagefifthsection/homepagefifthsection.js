import "./styles/homepagefifthsection.css";

import FifthSectionHeaderContainer from "./subcomps/fifthsectionheadercontainer";
import FifthSectionBoardingPoint from "./subcomps/fifthsectiononboardingpoints";

export default function HomePageFifthSection({
  fifthsectionheading,
  fifthsectiondescription,
  fifthsectionpointscollection,
  fifthsectionheaderimage,
}) {
  return (
    <div className="fifthsection-container" id="process">
      <FifthSectionHeaderContainer
        fifthsectionheading={fifthsectionheading}
        fifthsectiondescription={fifthsectiondescription}
        fifthsectionheaderimage={fifthsectionheaderimage}
      />
      <FifthSectionBoardingPoint
        fifthsectionpointscollection={fifthsectionpointscollection}
      />
    </div>
  );
}
