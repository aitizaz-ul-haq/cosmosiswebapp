import "./styles/homepagesixsection.css";

import SectionSixLeftPart from "./subcomps/sectionsixleftpart";
import SectionSixRightPart from "./subcomps/sectionsixrightpart";

export default function HomePageSixSection({
  sixsectionlefttagtitle,
  sixsectionleftheading,
  sixsectionleftpara,
  sixsectionpoints,
  rightsectionsixmiddleimage,
}) {
  return (
    <div className="sectionsix-container" id="technology">
      <SectionSixLeftPart
        sixsectionlefttagtitle={sixsectionlefttagtitle}
        sixsectionleftheading={sixsectionleftheading}
        sixsectionleftpara={sixsectionleftpara}
        sixsectionpoints={sixsectionpoints}
      />
      <SectionSixRightPart
        rightsectionsixmiddleimage={rightsectionsixmiddleimage}
      />
    </div>
  );
}
