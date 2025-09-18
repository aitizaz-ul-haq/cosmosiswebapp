export default function TopSectionTextContainer({
  loginpagetitle,
  loginpagedescription,
}) {
  return (
    <div className="topsection-text-container">
      <h2 className="topsection-heading">{loginpagetitle}</h2>
      <p className="topsection-description">{loginpagedescription}</p>
    </div>
  );
}
