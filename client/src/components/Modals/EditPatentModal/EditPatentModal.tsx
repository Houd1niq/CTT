import {PatentForm} from "../PatentForm/PatentForm.tsx";
import {Patent, patentsApiSlice} from "../../../services/CTTApi/patentsApiSlice.ts";
import {useEffect} from "react";

type AddPatentModalProps = {
  onClose: () => void;
  visible: boolean;
  patent: Patent;
}

export const EditPatentModal = (props: AddPatentModalProps) => {
  const {visible, onClose, patent} = props;

  const [trigger, response] = patentsApiSlice.useEditPatentMutation()
  const {data: patentTypes} = patentsApiSlice.useGetPatentTypesQuery('')
  const {data: technologyFields} = patentsApiSlice.useGetTechnologyFieldsQuery('')

  const handleCloseEditPopup = (forceClose: boolean = false) => {
    if (!forceClose) {
      const confirmClose = window.confirm(
        'Вы уверены, что хотите закрыть окно? Все несохраненные изменения будут потеряны.',
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  const handleSubmit = (form: FormData) => {
    form.delete('patentFile');
    //transform formData to object
    const entries = form.entries();
    const formObj = Object.fromEntries(entries);
    // @ts-ignore
    trigger({data: formObj, id: patent.id});
  }

  useEffect(() => {
    if (response.isSuccess) {
      handleCloseEditPopup(true)
    }
  }, [response])

  if (!visible) return null;

  return (
    <div className="popupContainer" onClick={() => handleCloseEditPopup()}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <PatentForm
          technologyFields={technologyFields}
          patentTypes={patentTypes}
          onSubmit={handleSubmit}
          formType="edit"
          patent={patent}
        />
      </div>
    </div>
  );
};
