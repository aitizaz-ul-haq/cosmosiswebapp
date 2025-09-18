import Image from "next/image";

export default function SectionSixRightPart({rightsectionsixmiddleimage}) {
  return (
    <div className="sectionsix-rightpart">
      <div className="sectionsix-image-container">
        <Image
          src={rightsectionsixmiddleimage.iconlink}
          width={rightsectionsixmiddleimage.width}
          height={rightsectionsixmiddleimage.height}
          alt={rightsectionsixmiddleimage.alt}
          title={rightsectionsixmiddleimage.title}
        />
      </div>
    </div>
  );
}
