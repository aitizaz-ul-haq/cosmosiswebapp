import SecondSectionRightParaone from "./secondsectionrightparaone";
import SecondSectionRightParaTwo from "./secondsectionrightparatwo";

export default function SecondSectionRightPart({
  secondsectionrightparaone,
  secondsectionrightparatwo,
}) {
  return (
    <div className="secondsection-right-part">
      <div className="secondsection-right-part-parasection-container">
        <SecondSectionRightParaone
          secondsectionrightparaone={secondsectionrightparaone}
        />
        <SecondSectionRightParaTwo
          secondsectionrightparatwo={secondsectionrightparatwo}
        />
      </div>
    </div>
  );
}
