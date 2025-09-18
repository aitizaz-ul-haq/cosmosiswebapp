import ReviewGridCardImage from "./sectionsevenreviewgridcomps/reviewgridcardimage";
import ReviewGridCardTextContainer from "./sectionsevenreviewgridcomps/reviewgridcardtextcontainer";

export default function SectionSevenGridStrip({ rev }) {
  return (
    <div className="sectionseven-reviewgrid-strip">
      <ReviewGridCardImage rev={rev} />
      <ReviewGridCardTextContainer rev={rev} />
    </div>
  );
}
