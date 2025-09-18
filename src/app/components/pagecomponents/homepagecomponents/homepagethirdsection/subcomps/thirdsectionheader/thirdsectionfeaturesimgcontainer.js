import Image from "next/image";

export default function ThirdSectionFeaturesImgContainer({
  thirdsectionleftimagelink,
}) {
  return (
    <div className="thirdsection-features-image-container">
      <Image
        src={thirdsectionleftimagelink.iconlink}
        width={thirdsectionleftimagelink.width}
        height={thirdsectionleftimagelink.height}
        alt={thirdsectionleftimagelink.alt}
        title={thirdsectionleftimagelink.title}
      />
    </div>
  );
}
