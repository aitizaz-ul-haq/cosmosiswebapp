import Image from "next/image";

export default function FifthSectionOnBoardingImage({ point }) {
  return (
    <Image
      src={point.imagelink}
      width={point.width}
      height={point.height}
      alt={point.alt}
      title={point.title}
    />
  );
}
