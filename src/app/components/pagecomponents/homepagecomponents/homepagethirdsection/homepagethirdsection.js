import "./styles/homepagethirdsection.css";

import ThirdSectionHeader from "./subcomps/thirdsectionheader/thirdsectionheader";
import ThirdSectionFeaturesGrid from "./subcomps/thirdsectionheader/thirdsectionfeaturesgrid";

export default function HomePageThirdSection({
  thirdsectionheaderheading,
  thirdsectionheaderdescription,
  thirdsectionleftimagelink,
  thirdsectiongridcardsdata,
}) {
  return (
    <div className="thirdsection-section-container" id="features">
      <ThirdSectionHeader
        thirdsectionheaderheading={thirdsectionheaderheading}
        thirdsectionheaderdescription={thirdsectionheaderdescription}
        thirdsectionleftimagelink={thirdsectionleftimagelink}
      />
      <ThirdSectionFeaturesGrid
        thirdsectiongridcardsdata={thirdsectiongridcardsdata}
      />
    </div>
  );
}
