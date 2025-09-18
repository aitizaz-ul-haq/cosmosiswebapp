import SecondSectionLeftTag from "./secondsectionlefttag";
import SecondSectionLeftHeading from "./secondsectionleftheading";

export default function SecondSectionLeftPart({
  secondsectiontagtitle,
  secondsectionlargeheadingleft,
}) {
  return (
    <div className="secondsection-left-part">
      <div className="secondsection-left-part-container">
        <SecondSectionLeftTag secondsectiontagtitle={secondsectiontagtitle} />
        <SecondSectionLeftHeading
          secondsectionlargeheadingleft={secondsectionlargeheadingleft}
        />
      </div>
    </div>
  );
}
