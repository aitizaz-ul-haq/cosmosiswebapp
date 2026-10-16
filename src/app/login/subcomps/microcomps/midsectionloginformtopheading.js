export default function MidSectionLoginFormTopHeading({ formtitle, formsubtitle }) {
  return (
    <div className="loginform-heading-block">
      <h2 className="loginform-heading">{formtitle}</h2>
      {formsubtitle ? <p className="loginform-subheading">{formsubtitle}</p> : null}
    </div>
  );
}
