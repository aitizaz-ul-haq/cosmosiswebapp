export default function ModalCloseButton({ onClose }) {
  return (
    <button className="generic-table-modal-close" onClick={onClose}>
      ×
    </button>
  );
}
