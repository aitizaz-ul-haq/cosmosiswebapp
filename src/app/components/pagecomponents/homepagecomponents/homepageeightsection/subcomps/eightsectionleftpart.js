import EightSectionLeftPartBottomSectionDemoSection from "./eightsectionleftpartbottomsectiondemocontaier";
import EightSectionLeftPartTopSection from "./eightsectionleftparttopsection";

export default function EightSectionLeftPart({
  eightsectionleftsectiontagtag,
  eightsectionleftsectionheading,
  eightsectiontopline,
  eightsectionbottomheading,
  eightsectionleftsectionbottomlines,
}) {
  return (
    <div className="eightsection-left-part">
      <EightSectionLeftPartTopSection
        eightsectionleftsectiontagtag={eightsectionleftsectiontagtag}
        eightsectionleftsectionheading={eightsectionleftsectionheading}
        eightsectiontopline={eightsectiontopline}
      />
      <EightSectionLeftPartBottomSectionDemoSection
        eightsectionbottomheading={eightsectionbottomheading}
        eightsectionleftsectionbottomlines={eightsectionleftsectionbottomlines}
      />
    </div>
  );
}
