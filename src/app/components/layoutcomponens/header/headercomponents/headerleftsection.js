import Image from "next/image";
import Link from "next/link";

export default function HeaderLeftSection() {
  return (
    <>
      <div className="header-left-logosection">
        <Link href="/" title="home">
          <Image
            src="/images/cosmosis-logo.png"
            alt="FGK logo"
            width={130}
            height={65}
            className="header-logo-img"
          />
        </Link>
        
      </div>
    </>
  );
}
