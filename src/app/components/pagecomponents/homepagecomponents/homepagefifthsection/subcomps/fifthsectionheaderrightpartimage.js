import Image from "next/image";

export default function FifthSectionHeaderRightPartImage({
  fifthsectionheaderimage,
}) {
  return (
    <Image
      src={fifthsectionheaderimage.imagelink}
      width={fifthsectionheaderimage.width}
      height={fifthsectionheaderimage.height}
      alt={fifthsectionheaderimage.alt}
      title={fifthsectionheaderimage.title}
      className="fifth-section-header-image"
    />
  );
}
