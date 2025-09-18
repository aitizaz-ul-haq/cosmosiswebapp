import Image from "next/image";
import EightSectionLeftPartTopSection from "./eightsectionleftparttopsection";

export default function EightSectionLeftPart({
  eightsectionleftsectiontagtag,
  eightsectionleftsectionheading,
  eightsectiontopline,
  eightsectionbottomheading,
  eightsectionleftsectionbottomlines,
}) {
  return (
    <div className="eightsection-left-part">
      <EightSectionLeftPartTopSection
        eightsectionleftsectiontagtag={eightsectionleftsectiontagtag}
        eightsectionleftsectionheading={eightsectionleftsectionheading}
        eightsectiontopline={eightsectiontopline}
      />
      <div className="left-part-bottomsection-demo-container">
        <div className="left-part-bottomsection-heading">
          {eightsectionbottomheading}
        </div>

        {eightsectionleftsectionbottomlines.map((line) => (
          <div
            className="left-part-bottomsection-instructions-container"
            key={line.id}
          >
            <div className="left-part-bottomsection-line">
              <Image
                src={line.iconlink}
                width={line.width}
                height={line.height}
                alt={line.alt}
                title={line.title}
              />
              <p className="left-part-bottomsection-statement">
                {line.demoline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
