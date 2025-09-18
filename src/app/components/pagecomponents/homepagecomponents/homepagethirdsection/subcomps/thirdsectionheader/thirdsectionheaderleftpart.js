import ThirdSectionFeaturesImgContainer from "./thirdsectionfeaturesimgcontainer";
import ThirdSectionFeaturesHeaderHeading from "./thirdsectionfeaturesheaderheading";

export default function ThirdSectionHeaderLeftPart({
  thirdsectionheaderheading,
  thirdsectionleftimagelink,
}) {
  return (
    <div className="thirdsection-left-part">
      <ThirdSectionFeaturesImgContainer
        thirdsectionleftimagelink={thirdsectionleftimagelink}
      />
      <ThirdSectionFeaturesHeaderHeading
        thirdsectionheaderheading={thirdsectionheaderheading}
      />
    </div>
  );
}
