export default function ThirdSectionRightTextGridCard({data}) {
  return (
    <div className="thirdsection-section-righttext-part">
      <h3 className="thirdsection-section-heading">{data.gridcardtitle}</h3>
      <p className="thirdsection-section-para">{data.gridcarddescription}</p>
    </div>
  );
}
