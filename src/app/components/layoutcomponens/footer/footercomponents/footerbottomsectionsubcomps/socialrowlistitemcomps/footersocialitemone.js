import Image from "next/image";

export default function FooterSocialItemOne() {
  return (
    <li className="footer-social-item">
      <div className="social-item-container">
        <Image
          src="/images/pin.png"
          alt="FGK logo"
          width={30}
          height={30}
          // className="header-logo-img"
        />
        <p className="socials-description">53 Davies Street, London W1K 5JH</p>
      </div>
    </li>
  );
}
