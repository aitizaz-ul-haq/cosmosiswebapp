import SectionFourLeftComps from "./sectionfourleftcomps";
import SectionFourPointsContainer from "./sectionfourpointscontainer";

export default function SectionFourLeftPart({
  fourthsectionlefttagtitle,
  fourthsectionleftheading,
  fouthsectionleftpara,
  fourthsectionpoints,
}) {
  return (
    <div className="sectionfour-leftpart">
      <SectionFourLeftComps
        fourthsectionlefttagtitle={fourthsectionlefttagtitle}
        fourthsectionleftheading={fourthsectionleftheading}
        fouthsectionleftpara={fouthsectionleftpara}
      />
      <SectionFourPointsContainer fourthsectionpoints={fourthsectionpoints} />
    </div>
  );
}
