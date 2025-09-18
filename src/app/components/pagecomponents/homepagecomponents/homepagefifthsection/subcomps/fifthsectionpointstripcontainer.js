export default function FifthSectionPointStripContainer({ point }) {
  return (
    <div className="fifthsection-pointstrip-text-container">
      <p className="fifthsection-oddpoint-heading">{point.pointsheading}</p>
      <p className="fifthsection-oddpoint-para">{point.pointsparagraph}</p>
    </div>
  );
}
