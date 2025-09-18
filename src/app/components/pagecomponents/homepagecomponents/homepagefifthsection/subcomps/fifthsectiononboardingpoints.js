import FifthSectionOnBoardingImage from "./fifthsectiononboardingimage";
import FifthSectionPointStripContainer from "./fifthsectionpointstripcontainer";

export default function FifthSectionBoardingPoint({
  fifthsectionpointscollection,
}) {
  return (
    <div className="fifthsection-onboarding-points-container">
      {fifthsectionpointscollection.map((point) => (
        <div className="fifthsection-oddpoints-container" key={point.id}>
          <FifthSectionOnBoardingImage point={point} />
          <FifthSectionPointStripContainer point={point} />
        </div>
      ))}
    </div>
  );
}
