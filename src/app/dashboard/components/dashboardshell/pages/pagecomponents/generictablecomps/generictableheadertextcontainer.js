export default function GenericTableHeaderTextContainer({
  title,
  description,
}) {
  return (
    <div className="generic-table-header-text-container">
      <h2 className="generic-table-heading">{title}</h2>
      {description && (
        <p className="generic-table-description">{description}</p>
      )}
    </div>
  );
}
