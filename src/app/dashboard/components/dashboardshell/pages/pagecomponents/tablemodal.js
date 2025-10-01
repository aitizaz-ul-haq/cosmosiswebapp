import ModalCloseButton from "./tablemodalsubcomps/modalclosebutton";
import ModalTitle from "./tablemodalsubcomps/modaltitle";
import ModalDetailsSection from "./tablemodalsubcomps/modaldetailssection";

export default function TableModal({ data, onClose, actions }) {
  if (!data) return null;

  return (
    <div className="generic-table-modal">
      <div className="generic-table-modal-content">
        <ModalCloseButton onClose={onClose} />
        <ModalTitle />
        <ModalDetailsSection actions={actions} data={data} />
      </div>
    </div>
  );
}
