import TopSectionTagContainer from "./topsectionsubcomps/topsectiontagcontainer";
import TopSectionHeading from "./topsectionsubcomps/topsectionheading";
import TopSectionDescription from "./topsectionsubcomps/topsectiondescription";

export default function EightSectionLeftPartTopSection({
  eightsectionleftsectiontagtag,
  eightsectionleftsectionheading,
  eightsectiontopline,
}) {
  return (
    <div className="left-part-topsection">
      <div className="left-part-topsection-text-container">
        <TopSectionTagContainer
          eightsectionleftsectiontagtag={eightsectionleftsectiontagtag}
        />
        <TopSectionHeading
          eightsectionleftsectionheading={eightsectionleftsectionheading}
        />
        <TopSectionDescription eightsectiontopline={eightsectiontopline} />
      </div>
    </div>
  );
}
