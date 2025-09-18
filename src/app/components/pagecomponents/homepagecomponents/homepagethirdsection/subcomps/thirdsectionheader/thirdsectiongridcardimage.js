import Image from "next/image";

export default function ThirdSectionGridImage({ data }) {
  return (
    <div className="thirdsection-section-lefticon-part">
      <Image
        src={data.iconlink}
        width={data.width}
        height={data.height}
        alt={data.alt}
        title={data.title}
      />
    </div>
  );
}
