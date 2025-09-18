import Image from "next/image";

export default function SectionFourRightPart({ rightsectionmiddleimage }) {
  return (
    <div className="sectionfour-rightpart">
      <div className="sectionfour-image-container">
        <Image
          src={rightsectionmiddleimage.iconlink}
          width={rightsectionmiddleimage.width}
          height={rightsectionmiddleimage.height}
          alt={rightsectionmiddleimage.alt}
          title={rightsectionmiddleimage.title}
        />
      </div>
    </div>
  );
}
