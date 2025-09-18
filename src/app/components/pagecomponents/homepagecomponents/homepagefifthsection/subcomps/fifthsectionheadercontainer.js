import FifthSectionHeaderLeftPart from "./fifthsectionheaderleftpart";
import FifthSectionHeaderRightPart from "./fifthsectionheaderrightpart";

export default function FifthSectionHeaderContainer({
  fifthsectionheading,
  fifthsectiondescription,
  fifthsectionheaderimage,
}) {
  return (
    <div className="fifthsection-header-container">
      <FifthSectionHeaderLeftPart
        fifthsectiondescription={fifthsectiondescription}
      />
      <FifthSectionHeaderRightPart
        fifthsectionheading={fifthsectionheading}
        fifthsectionheaderimage={fifthsectionheaderimage}
      />
    </div>
  );
}
