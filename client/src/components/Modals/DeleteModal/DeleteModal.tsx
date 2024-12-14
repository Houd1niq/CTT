import {Patent, patentsApiSlice} from "../../../services/CTTApi/patentsApiSlice.ts";
import {useEffect} from "react";
import './delete-modal.scss'

type DeleteModalProps = {
  patentToDelete: Patent;
  visible: boolean;
  onClose: () => void;
}

export const DeleteModal = (props: DeleteModalProps) => {
  const {patentToDelete, visible, onClose} = props;

  const [trigger, deleteResponse] = patentsApiSlice.useDeletePatentMutation()

  const handleConfirmDelete = () => {
    trigger(patentToDelete.patentNumber);
  };

  useEffect(() => {
    if (deleteResponse.isSuccess) {
      onClose();
    }
  }, [deleteResponse]);


  if (!visible) return null

  return (
    <div className="popupContainerDelete">
      <div className="popupDelete">
        <p>
          Вы уверены, что хотите удалить патент "
          <span className="patentName">{patentToDelete.name}</span>"?
        </p>
        <div className="popupButtonsDelete">
          <button
            className="confirmDeleteButton"
            onClick={handleConfirmDelete}
          >
            Да
          </button>
          <button className="closeButton" onClick={onClose}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};
