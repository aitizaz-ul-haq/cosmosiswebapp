import "./styles/homepagefoursection.css";

import SectionFourLeftPart from "./sectionfourleftpart";
import SectionFourRightPart from "./sectionfourrightpart";

export default function HomePageFourSection({
  fourthsectionlefttagtitle,
  fourthsectionleftheading,
  fouthsectionleftpara,
  fourthsectionpoints,
  rightsectionmiddleimage,
}) {
  return (
    <div className="sectionfour-container" id="benefits">
      <SectionFourLeftPart
        fourthsectionlefttagtitle={fourthsectionlefttagtitle}
        fourthsectionleftheading={fourthsectionleftheading}
        fouthsectionleftpara={fouthsectionleftpara}
        fourthsectionpoints={fourthsectionpoints}
      />
      <SectionFourRightPart rightsectionmiddleimage={rightsectionmiddleimage} />
    </div>
  );
}
