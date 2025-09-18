export default function ReviewGridCardTextContainer({ rev }) {
  return (
    <div className="sectionseven-reviewgrid-strip-text-container">
      <div className="sectionseven-reviewgrid-strip-para">{rev.reviewtext}</div>
      <div className="sectionseven-person-container">
        <p className="sectionseven-reviewgrid-strip-text">{rev.reviewer}</p>
      </div>
    </div>
  );
}
