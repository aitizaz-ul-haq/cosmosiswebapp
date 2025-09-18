import "./styles/homepagesevensection.css";

import SectionSevenLeftPart from "./subcomps/sectionsevenleftpart";
import SectionSevenRIghtPart from "./subcomps/sectionsevenrightpart";

export default function HomePageSevenSection({
  sevensectionlefttagtitle,
  sevensectionleftheading,
  sevensectionleftpara,
  sevensectionreviewsgriddata,
}) {
  return (
    <div className="sectionseven-container" id="reviews">
      <SectionSevenLeftPart
        sevensectionlefttagtitle={sevensectionlefttagtitle}
        sevensectionleftheading={sevensectionleftheading}
        sevensectionleftpara={sevensectionleftpara}
      />
      <SectionSevenRIghtPart
        sevensectionreviewsgriddata={sevensectionreviewsgriddata}
      />
    </div>
  );
}
