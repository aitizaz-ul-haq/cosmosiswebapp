import Image from "next/image";

export default function FooterSocialItemThree() {
  return (
    <li className="footer-social-item">
      <div className="social-item-container">
        <Image
          src="/images/global.png"
          alt="FGK logo"
          width={30}
          height={30}
          // className="header-logo-img"
        />
        <p className="socials-description">info@cosmosis.com</p>
      </div>
    </li>
  );
}
