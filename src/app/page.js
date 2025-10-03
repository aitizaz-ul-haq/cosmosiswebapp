import MainHeroSection from "./components/sharedcomponents/mainherosection/mainherosection";
import HomePageContainer from "./components/pagecomponents/homepagecomponents/homepagecontainer/homepagecontainer";
import Homepagedata from "@/app/data/homepagedata/homaepagedata.json";
import Header from "./components/layoutcomponens/header/header";
import Footer from "./components/layoutcomponens/footer/footer";

//--Hero section data----------------------------------
let herobottomsectiontextbold =
  Homepagedata.herosection.herobottomsectiontextbold;
let herobottomsectiontext = Homepagedata.herosection.herobottomsectiontextbold;
let herobackgroundimage = Homepagedata.herosection.backgroundImages;

//--home page second section data-------------------------
let secondsectiontagtitle = Homepagedata.homepagesecondsection.tagtitle;
let secondsectionlargeheadingleft =
  Homepagedata.homepagesecondsection.largeheadingleftpart;
let secondsectionrightparaone =
  Homepagedata.homepagesecondsection.firstsectionparaone;
let secondsectionrightparatwo =
  Homepagedata.homepagesecondsection.secondsectionparatwo;

//--home page third section data--------------------------
let thirdsectionheaderheading = Homepagedata.homepagethirdsection.headerheading;
let thirdsectionheaderdescription =
  Homepagedata.homepagethirdsection.headerdescription;
let thirdsectionleftimagelink =
  Homepagedata.homepagethirdsection.headerleftimage;
let thirdsectiongridcardsdata =
  Homepagedata.homepagethirdsection.thirdsectiongridcards;

//--home page fourth section data-------------------------
let fourthsectionlefttagtitle =
  Homepagedata.homepagefourthsection.leftsectiontagtitle;
let fourthsectionleftheading =
  Homepagedata.homepagefourthsection.leftsectionheading;
let fouthsectionleftpara = Homepagedata.homepagefourthsection.leftsectionpara;
let fourthsectionpoints =
  Homepagedata.homepagefourthsection.leftsectionbenefitspoint;
let rightsectionmiddleimage =
  Homepagedata.homepagefourthsection.rightsectionmiddleimage;

//--home page fifth section data-------------------------
let fifthsectionheading = Homepagedata.homepagefifthsection.fifthsectionheading;
let fifthsectiondescription =
  Homepagedata.homepagefifthsection.fifthsectiondescription;
let fifthsectionheaderimage =
  Homepagedata.homepagefifthsection.fifthsectionheaderimage;
let fifthsectionpointscollection =
  Homepagedata.homepagefifthsection.fifthsectionpointscollection;

//--home page six section data-------------------------
let sixsectionlefttagtitle =
  Homepagedata.homepagesixsection.leftsectiontagtitle;
let sixsectionleftheading = Homepagedata.homepagesixsection.leftsectionheading;
let sixsectionleftpara = Homepagedata.homepagesixsection.leftsectionpara;
let sixsectionpoints = Homepagedata.homepagesixsection.leftsectionbenefitspoint;
let rightsectionsixmiddleimage =
  Homepagedata.homepagesixsection.rightsectionsixmiddleimage;

//--home page seven section data-----------------------
let sevensectionlefttagtitle =
  Homepagedata.homepagesevensection.leftsectiontagtitle;
let sevensectionleftheading =
  Homepagedata.homepagesevensection.leftsectionheading;
let sevensectionleftpara = Homepagedata.homepagesevensection.leftsectionpara;
let sevensectionreviewsgriddata =
  Homepagedata.homepagesevensection.rightsectiongridstripdata;

//--home page eight section data-----------------------
let eightsectionleftsectiontagtag =
  Homepagedata.homepageeightsection.leftsectiontagtag;
let eightsectionleftsectionheading =
  Homepagedata.homepageeightsection.leftsectionheading;
let eightsectiontopline = Homepagedata.homepageeightsection.leftsectiontopline;
let eightsectionbottomheading =
  Homepagedata.homepageeightsection.leftsectionbottomheading;
let eightsectionleftsectionbottomlines =
  Homepagedata.homepageeightsection.leftsectionbottomlines;

export default function Home() {
  return (
    <>
      <Header />
      <MainHeroSection
        herobottomsectiontextbold={herobottomsectiontextbold}
        herobottomsectiontext={herobottomsectiontext}
        herobackgroundimage={herobackgroundimage}
      />
      <HomePageContainer
        secondsectiontagtitle={secondsectiontagtitle}
        secondsectionlargeheadingleft={secondsectionlargeheadingleft}
        secondsectionrightparaone={secondsectionrightparaone}
        secondsectionrightparatwo={secondsectionrightparatwo}
        thirdsectionheaderheading={thirdsectionheaderheading}
        thirdsectionheaderdescription={thirdsectionheaderdescription}
        thirdsectionleftimagelink={thirdsectionleftimagelink}
        thirdsectiongridcardsdata={thirdsectiongridcardsdata}
        fourthsectionlefttagtitle={fourthsectionlefttagtitle}
        fourthsectionleftheading={fourthsectionleftheading}
        fouthsectionleftpara={fouthsectionleftpara}
        fourthsectionpoints={fourthsectionpoints}
        rightsectionmiddleimage={rightsectionmiddleimage}
        fifthsectionheading={fifthsectionheading}
        fifthsectiondescription={fifthsectiondescription}
        fifthsectionpointscollection={fifthsectionpointscollection}
        fifthsectionheaderimage={fifthsectionheaderimage}
        sixsectionlefttagtitle={sixsectionlefttagtitle}
        sixsectionleftheading={sixsectionleftheading}
        sixsectionleftpara={sixsectionleftpara}
        sixsectionpoints={sixsectionpoints}
        rightsectionsixmiddleimage={rightsectionsixmiddleimage}
        sevensectionlefttagtitle={sevensectionlefttagtitle}
        sevensectionleftheading={sevensectionleftheading}
        sevensectionleftpara={sevensectionleftpara}
        sevensectionreviewsgriddata={sevensectionreviewsgriddata}
        eightsectionleftsectiontagtag={eightsectionleftsectiontagtag}
        eightsectionleftsectionheading={eightsectionleftsectionheading}
        eightsectiontopline={eightsectiontopline}
        eightsectionbottomheading={eightsectionbottomheading}
        eightsectionleftsectionbottomlines={eightsectionleftsectionbottomlines}
      />
      <Footer />
    </>
  );
}
