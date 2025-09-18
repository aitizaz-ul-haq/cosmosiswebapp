export default function SectionSixLeftTagContainerComps({
  sixsectionlefttagtitle,
  sixsectionleftheading,
  sixsectionleftpara,
}) {
  return (
    <>
      <div className="sectionsix-tag-container">
        <div className="sectionsix-tag">{sixsectionlefttagtitle}</div>
      </div>
      <div className="sectionsix-heading">{sixsectionleftheading}</div>
      <p className="sectionsix-para">{sixsectionleftpara}</p>
    </>
  );
}
