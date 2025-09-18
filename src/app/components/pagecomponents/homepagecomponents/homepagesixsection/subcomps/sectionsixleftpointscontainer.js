export default function SectionSixLeftPointsContainer({ sixsectionpoints }) {
  return (
    <>
      {sixsectionpoints.map((point) => (
        <div className="sectionsix-points-container" key={point.id}>
          <p className="sectionsix-point">{point.pointtext}</p>
        </div>
      ))}
    </>
  );
}
