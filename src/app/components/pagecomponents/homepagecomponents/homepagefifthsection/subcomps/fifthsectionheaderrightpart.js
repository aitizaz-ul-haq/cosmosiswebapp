import FifthSectionHeaderRightPartImage from "./fifthsectionheaderrightpartimage";
import FifthSectionHeaderRIghtPartHeading from "./fifthsectionheaderrightpartheading";

export default function FifthSectionHeaderRightPart({
  fifthsectionheading,
  fifthsectionheaderimage,
}) {
  return (
    <div className="fifthsection-header-rightpart">
      <FifthSectionHeaderRIghtPartHeading
        fifthsectionheading={fifthsectionheading}
      />
      <FifthSectionHeaderRightPartImage
        fifthsectionheaderimage={fifthsectionheaderimage}
      />
    </div>
  );
}
