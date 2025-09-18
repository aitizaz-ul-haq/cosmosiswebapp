import "./styles/homepagesecondsection.css";
import SecondSectionRightPart from "./subcomps/secondsectionleftpart/secondsectionrightpart";
import SecondSectionLeftPart from "./subcomps/secondsectionrightpart/secondsectionleftpart";

export default function HomePageSecondSection({
  secondsectiontagtitle,
  secondsectionlargeheadingleft,
  secondsectionrightparaone,
  secondsectionrightparatwo,
}) {
  return (
    <div className="secondsection-section-container" id="about">
      <SecondSectionLeftPart
        secondsectiontagtitle={secondsectiontagtitle}
        secondsectionlargeheadingleft={secondsectionlargeheadingleft}
      />
      <SecondSectionRightPart
        secondsectionrightparaone={secondsectionrightparaone}
        secondsectionrightparatwo={secondsectionrightparatwo}
      />
    </div>
  );
}
