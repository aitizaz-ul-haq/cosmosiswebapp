import Image from "next/image";

export default function ReviewGridCardImage({ rev }) {
  return (
    <Image
      src={rev.iconlink}
      width={rev.width}
      height={rev.height}
      alt={rev.alt}
      title={rev.title}
    />
  );
}
