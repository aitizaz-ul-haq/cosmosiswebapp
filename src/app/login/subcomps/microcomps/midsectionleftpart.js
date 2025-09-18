import Image from "next/image";

export default function MidSectionLeftPart({ loginleftsideimagedata }) {
  return (
    <div className="midsection-leftpart">
      <div className="midsection-leftpart-imageconatiner">
        <Image
          src={loginleftsideimagedata.src}
          title={loginleftsideimagedata.title}
          alt={loginleftsideimagedata.alt}
          width={loginleftsideimagedata.width}
          height={loginleftsideimagedata.height}
        />
      </div>
    </div>
  );
}
