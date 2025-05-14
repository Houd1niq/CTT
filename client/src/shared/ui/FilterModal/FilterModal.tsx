import {useState} from "react";
import './filter-modal.scss'
import {Input} from "../Input/Input.tsx";

type AddFilterProps = {
  title: 'вид патента' | 'область техники'
  visible: boolean;
  onClose: () => void;
  onSubmit: (arg: { id: number, name: string }) => void
  contentToEdit?: { id: number, name: string }
}

export const FilterModal = (props: AddFilterProps) => {
  const {visible, onClose, title, onSubmit, contentToEdit} = props;

  const [name, setName] = useState<string>(contentToEdit?.name || '')

  if (!visible) return null

  const handleConfirm = () => {
    onSubmit({id: contentToEdit?.id || 0, name})
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="filter-modal-container">
      <div className="filter-modal">
        <Input
          title={`Введите ${title}`}
          onChange={handleChange}
          value={name}
          type="text"
          name="filter-input"
        />
        <div className="popupButtonsDelete">
          <button
            className="confirmDeleteButton"
            onClick={handleConfirm}
          >
            Добавить
          </button>
          <button className="closeButton" onClick={onClose}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};
