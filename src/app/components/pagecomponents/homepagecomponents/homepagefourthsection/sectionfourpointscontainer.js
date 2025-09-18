export default function SectionFourPointsContainer({ fourthsectionpoints }) {
  return (
    <>
      {fourthsectionpoints.map((point) => (
        <div className="sectionfour-points-container" key={point.id}>
          <p className="sectionfour-point">{point.pointtext}</p>
        </div>
      ))}
    </>
  );
}
