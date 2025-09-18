import Image from "next/image";
import Link from "next/link";

export default function FooterUpperSectionLogoContainer() {
  return (
    <div className="footer-leftsection-logo-container">
      <Link href="/" title="home">
        <Image
          src="/images/footer_logo.png"
          alt="FGK logo"
          width={325}
          height={162}
          className="footer-logo-img"
        />
      </Link>
    </div>
  );
}
