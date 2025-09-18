import Image from "next/image";

export default function FooterSocialItemFour() {
  return (
    <li className="footer-social-item">
      <div className="socialicons-item-container">
        <Image
          src="/images/facebook.png"
          alt="FGK logo"
          width={39}
          height={39}
          // className="header-logo-img"
        />
        <Image
          src="/images/linkedin.png"
          alt="FGK logo"
          width={39}
          height={39}
          // className="header-logo-img"
        />
        <Image
          src="/images/instagram.png"
          alt="FGK logo"
          width={39}
          height={39}
          // className="header-logo-img"
        />
        <Image
          src="/images/twitter.png"
          alt="FGK logo"
          width={39}
          height={39}
          // className="header-logo-img"
        />
        <Image
          src="/images/youtube.png"
          alt="FGK logo"
          width={39}
          height={39}
          // className="header-logo-img"
        />
      </div>
    </li>
  );
}
