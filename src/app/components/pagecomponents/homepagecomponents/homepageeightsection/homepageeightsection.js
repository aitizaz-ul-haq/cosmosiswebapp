import "./styles/homepageeightsection.css";
import "./styles/contactformsection.css";

import EightSectionLeftPart from "./subcomps/eightsectionleftpart";
import EightSectionRightPart from "./subcomps/eightsectionrightpart";

export default function HomePageEightSection({
  eightsectionleftsectiontagtag,
  eightsectionleftsectionheading,
  eightsectiontopline,
  eightsectionbottomheading,
  eightsectionleftsectionbottomlines,
}) {
  return (
    <div className="eightsection-container" id="demo">
      <EightSectionLeftPart
        eightsectionleftsectiontagtag={eightsectionleftsectiontagtag}
        eightsectionleftsectionheading={eightsectionleftsectionheading}
        eightsectiontopline={eightsectiontopline}
        eightsectionbottomheading={eightsectionbottomheading}
        eightsectionleftsectionbottomlines={eightsectionleftsectionbottomlines}
      />
      <EightSectionRightPart />
    </div>
  );
}
