import Image from "next/image";

export default function DashboardHeaderIconButton({
  src,
  alt,
  tooltip,
  dataLogTitle,
  onClick,
}) {
  return (
    <button
      type="button"
      className="dashboard-header-icon-button"
      onClick={onClick}
      data-tooltip={tooltip}
      data-log-title={dataLogTitle}
      aria-label={tooltip}
    >
      <Image
        src={src}
        width={22}
        height={22}
        alt={alt}
        className="dashboard-header-icon-img"
      />
    </button>
  );
}
