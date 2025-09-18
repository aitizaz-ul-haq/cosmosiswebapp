import Head from "next/head";
import "./styles/mainherosection.css";

export default function MainHeroSection({
  herobackgroundimage,
  herobottomsectiontextbold,
  herobottomsectiontext,
}) {
  const preloadImage = herobackgroundimage["1920px"];

  return (
    <>
      {/* Preload largest background image */}
      <Head>
        <link
          rel="preload"
          as="image"
          href={preloadImage}
          imagesrcset={`
            ${herobackgroundimage["375px"]} 375w,
            ${herobackgroundimage["390px"]} 390w,
            ${herobackgroundimage["430px"]} 430w,
            ${herobackgroundimage["480px"]} 480w,
            ${herobackgroundimage["600px"]} 600w,
            ${herobackgroundimage["768px"]} 768w,
            ${herobackgroundimage["1024px"]} 1024w,
            ${herobackgroundimage["1280px"]} 1280w,
            ${herobackgroundimage["1440px"]} 1440w,
            ${herobackgroundimage["1600px"]} 1600w,
            ${herobackgroundimage["1920px"]} 1920w,
            ${herobackgroundimage["2560px"]} 2560w
          `}
          imagesizes="100vw"
          fetchpriority="high"
        />
      </Head>

      <div
        className="main-hero-section-container"
        style={{
          "--bg-320": `url(${herobackgroundimage["320px"]})`,
          "--bg-360": `url(${herobackgroundimage["360px"]})`,
          "--bg-375": `url(${herobackgroundimage["375px"]})`,
          "--bg-390": `url(${herobackgroundimage["390px"]})`,
          "--bg-430": `url(${herobackgroundimage["430px"]})`,
          "--bg-480": `url(${herobackgroundimage["480px"]})`,
          "--bg-600": `url(${herobackgroundimage["600px"]})`,
          "--bg-768": `url(${herobackgroundimage["768px"]})`,
          "--bg-1024": `url(${herobackgroundimage["1024px"]})`,
          "--bg-1280": `url(${herobackgroundimage["1280px"]})`,
          "--bg-1440": `url(${herobackgroundimage["1440px"]})`,
          "--bg-1600": `url(${herobackgroundimage["1600px"]})`,
          "--bg-1920": `url(${herobackgroundimage["1920px"]})`,
          "--bg-2560": `url(${herobackgroundimage["2560px"]})`,
        }}
      >
        <div className="bottom-herosection-container">
          <div className="bottom-herosection-content-container">
            <div className="bottom-herosection-text-container">
              <p className="bottom-herosection-text">
                A
                <span className="bottom-herosection-bold-text">
                  {herobottomsectiontextbold}
                </span>
                {herobottomsectiontext}
              </p>
            </div>
            <div className="bottom-herosection-button-container">
              <button className="bottom-herosection-button">
                Discover Solutions
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
