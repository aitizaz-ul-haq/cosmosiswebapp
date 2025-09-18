import ThirdSectionHeaderLeftPart from "./thirdsectionheaderleftpart";
import ThirdSectionHeaderRightPart from "./thirdsectionheaderrightpart";

export default function ThirdSectionHeader({
  thirdsectionheaderheading,
  thirdsectionheaderdescription,
  thirdsectionleftimagelink,
}) {
  return (
    <div className="thirdsection-section-header">
      <ThirdSectionHeaderLeftPart
        thirdsectionheaderheading={thirdsectionheaderheading}
        thirdsectionleftimagelink={thirdsectionleftimagelink}
      />
      <ThirdSectionHeaderRightPart
        thirdsectionheaderdescription={thirdsectionheaderdescription}
      />
    </div>
  );
}
