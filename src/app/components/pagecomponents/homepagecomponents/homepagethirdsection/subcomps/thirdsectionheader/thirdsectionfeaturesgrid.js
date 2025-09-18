import ThirdSectionGridImage from "./thirdsectiongridcardimage";
import ThirdSectionRightTextGridCard from "./thirdsectionrighttextgridcard";

export default function ThirdSectionFeaturesGrid({
  thirdsectiongridcardsdata,
}) {
  return (
    <div className="thirdsection-section-features-grid">
      {thirdsectiongridcardsdata.map((data, index) => (
        <div className="thirdsection-section-gridcard" key={index}>
          <ThirdSectionGridImage data={data} />
          <ThirdSectionRightTextGridCard data={data} />
        </div>
      ))}
    </div>
  );
}
