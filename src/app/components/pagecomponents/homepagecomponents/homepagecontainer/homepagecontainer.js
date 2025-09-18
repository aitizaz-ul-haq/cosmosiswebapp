import HomePageSecondSection from "../homepagesecondsection/homepagesecondsection";
import HomePageThirdSection from "../homepagethirdsection/homepagethirdsection";
import HomePageFourSection from "../homepagefourthsection/homepagefoursection";
import HomePageFifthSection from "../homepagefifthsection/homepagefifthsection";
import HomePageSixSection from "../homepagesixsection/homepagesixsection";
import HomePageSevenSection from "../homepagesevensection/homepagesevensection";
import HomePageEightSection from "../homepageeightsection/homepageeightsection";

export default function HomePageContainer({
  secondsectiontagtitle,
  secondsectionlargeheadingleft,
  secondsectionrightparaone,
  secondsectionrightparatwo,
  thirdsectionheaderheading,
  thirdsectionheaderdescription,
  thirdsectionleftimagelink,
  thirdsectiongridcardsdata,
  fourthsectionlefttagtitle,
  fourthsectionleftheading,
  fouthsectionleftpara,
  fourthsectionpoints,
  rightsectionmiddleimage,
  fifthsectionheading,
  fifthsectiondescription,
  fifthsectionpointscollection,
  fifthsectionheaderimage,
  sixsectionlefttagtitle,
  sixsectionleftheading,
  sixsectionleftpara,
  sixsectionpoints,
  rightsectionsixmiddleimage,
  sevensectionlefttagtitle,
  sevensectionleftheading,
  sevensectionleftpara,
  sevensectionreviewsgriddata,
  eightsectionleftsectiontagtag,
  eightsectionleftsectionheading,
  eightsectiontopline,
  eightsectionbottomheading,
  eightsectionleftsectionbottomlines,
}) {
  return (
    <div className="main-page-container">
      <HomePageSecondSection
        secondsectiontagtitle={secondsectiontagtitle}
        secondsectionlargeheadingleft={secondsectionlargeheadingleft}
        secondsectionrightparaone={secondsectionrightparaone}
        secondsectionrightparatwo={secondsectionrightparatwo}
      />
      <HomePageThirdSection
        thirdsectionheaderheading={thirdsectionheaderheading}
        thirdsectionheaderdescription={thirdsectionheaderdescription}
        thirdsectionleftimagelink={thirdsectionleftimagelink}
        thirdsectiongridcardsdata={thirdsectiongridcardsdata}
      />
      <HomePageFourSection
        fourthsectionlefttagtitle={fourthsectionlefttagtitle}
        fourthsectionleftheading={fourthsectionleftheading}
        fouthsectionleftpara={fouthsectionleftpara}
        fourthsectionpoints={fourthsectionpoints}
        rightsectionmiddleimage={rightsectionmiddleimage}
      />
      <HomePageFifthSection
        fifthsectionheading={fifthsectionheading}
        fifthsectiondescription={fifthsectiondescription}
        fifthsectionpointscollection={fifthsectionpointscollection}
        fifthsectionheaderimage={fifthsectionheaderimage}
      />
      <HomePageSixSection
        sixsectionlefttagtitle={sixsectionlefttagtitle}
        sixsectionleftheading={sixsectionleftheading}
        sixsectionleftpara={sixsectionleftpara}
        sixsectionpoints={sixsectionpoints}
        rightsectionsixmiddleimage={rightsectionsixmiddleimage}
      />
      <HomePageSevenSection
        sevensectionlefttagtitle={sevensectionlefttagtitle}
        sevensectionleftheading={sevensectionleftheading}
        sevensectionleftpara={sevensectionleftpara}
        sevensectionreviewsgriddata={sevensectionreviewsgriddata}
      />
      <HomePageEightSection
        eightsectionleftsectiontagtag={eightsectionleftsectiontagtag}
        eightsectionleftsectionheading={eightsectionleftsectionheading}
        eightsectiontopline={eightsectiontopline}
        eightsectionbottomheading={eightsectionbottomheading}
        eightsectionleftsectionbottomlines={eightsectionleftsectionbottomlines}
      />
    </div>
  );
}
