import SectionSevenGridStrip from "./sectionsevengridstrip";

export default function SectionSevenRIghtPart({ sevensectionreviewsgriddata }) {
  return (
    <div className="sectionseven-right-part">
      {sevensectionreviewsgriddata.map((rev) => (
        <div className="sectionseven-review-container" key={rev.id}>
          <SectionSevenGridStrip rev={rev} />
        </div>
      ))}
    </div>
  );
}
