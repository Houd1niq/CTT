import './delete-modal.scss'

type DeleteModalProps<T> = {
  // patentToDelete?: Patent;
  name?: string;
  identifier?: T;
  visible: boolean;
  onClose: () => void;
  onSubmit: (identifier: T) => void;
  title: string
}

export const DeleteModal = <T = number>(props: DeleteModalProps<T>) => {
  const {visible, onClose, onSubmit, title, name, identifier} = props;

  if (!visible || !identifier) return null

  const handleConfirmDelete = () => {
    onSubmit(identifier);
  };

  return (
    <div className="popupContainerDelete">
      <div className="popupDelete">
        <p>
          {title} "
          <span className="patentName">{name}</span>"?
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
