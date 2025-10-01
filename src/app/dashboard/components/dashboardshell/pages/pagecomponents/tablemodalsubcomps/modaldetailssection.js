export default function ModalDetailsSection({actions, data}) {
  // Define keys to hide
  const hiddenKeys = ["_id", "__v", "updatedAt"];

  return (
    <div className="modal-details-section">
      {Object.keys(data)
        .filter((key) => !hiddenKeys.includes(key)) // 🚫 filter out unwanted keys
        .map((key) => (
          <p key={key}>
            <b>{key}:</b>{" "}
            {key.toLowerCase().includes("date")
              ? new Date(data[key]).toLocaleString()
              : data[key]?.toString()}
          </p>
        ))}
      {actions && actions.length > 0 && (
        <div className="generic-table-modal-actions">
          {actions.map((act, idx) => (
            <button
              key={idx}
              className={act.className}
              onClick={() => act.onClick(data._id)}
            >
              {act.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
