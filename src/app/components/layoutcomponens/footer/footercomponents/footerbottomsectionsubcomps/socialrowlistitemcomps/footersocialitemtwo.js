import Image from "next/image";

export default function FooterSocialItemTwo() {
  return (
    <li className="footer-social-item">
      <div className="social-item-container">
        <Image
          src="/images/telephone.png"
          alt="FGK logo"
          width={30}
          height={30}
          // className="header-logo-img"
        />
        <p className="socials-description">+44 203 167 6000</p>
      </div>
    </li>
  );
}
