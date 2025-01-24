import {PatentForm} from "../PatentForm/PatentForm.tsx";
import {patentsApiSlice} from "../../../services/CTTApi/patentsApiSlice.ts";
import {useEffect} from "react";
import {filtersApiSlice} from "../../../services/CTTApi/filtersApiSlice.ts";

type AddPatentModalProps = {
  onClose: () => void;
  visible: boolean;
}

export const AddPatentModal = (props: AddPatentModalProps) => {
  const {visible, onClose} = props;

  const [trigger, response] = patentsApiSlice.useCreatePatentMutation()
  const {data: patentTypes} = filtersApiSlice.useGetPatentTypesQuery('')
  const {data: technologyFields} = filtersApiSlice.useGetTechnologyFieldsQuery('')

  const handleCloseAddPopup = (forceClose: boolean = false) => {
    if (!forceClose) {
      const confirmClose = window.confirm(
        'Вы уверены, что хотите закрыть окно? Все несохраненные изменения будут потеряны.',
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  const handleSubmit = (form: FormData) => {
    trigger(form);
  }

  useEffect(() => {
    if (response.isSuccess) {
      handleCloseAddPopup(true)
    }
  }, [response])

  if (!visible) return null;

  return (
    <div className="popupContainer" onClick={() => handleCloseAddPopup()}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <PatentForm
          technologyFields={technologyFields}
          patentTypes={patentTypes}
          onSubmit={handleSubmit}
          formType="add"/>
      </div>
    </div>
  );
};
