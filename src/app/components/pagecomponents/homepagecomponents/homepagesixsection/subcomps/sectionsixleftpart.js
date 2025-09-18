import SectionSixLeftTagContainerComps from "./sectionsixlefttagcontainercomps";
import SectionSixLeftPointsContainer from "./sectionsixleftpointscontainer";

export default function SectionSixLeftPart({
  sixsectionlefttagtitle,
  sixsectionleftheading,
  sixsectionleftpara,
  sixsectionpoints,
}) {
  return (
    <div className="sectionsix-leftpart">
      <SectionSixLeftTagContainerComps
        sixsectionlefttagtitle={sixsectionlefttagtitle}
        sixsectionleftheading={sixsectionleftheading}
        sixsectionleftpara={sixsectionleftpara}
      />
      <SectionSixLeftPointsContainer sixsectionpoints={sixsectionpoints} />
    </div>
  );
}
