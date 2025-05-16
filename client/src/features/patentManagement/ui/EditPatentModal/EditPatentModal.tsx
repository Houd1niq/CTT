import {PatentForm} from "../PatentForm/PatentForm.tsx";
import {patentsApiSlice} from "@entities/patent/api/patentsApiSlice.ts";
import {useEffect} from "react";
import './edit-patent-modal.scss'
import {technologyFieldApiSlice} from "@entities/technologyField/api/technologyFieldApiSlice.ts";
import {patentTypeApiSlice} from "@entities/patentType/api/patentTypeApiSlice.ts";
import {Patent} from "@entities/patent";
import {useIsAdmin, useModalOverflow} from "@shared/utils/hooks.ts";
import {instituteApiSlice} from "@entities/institute";
import {userApiSlice} from "@entities/user";

type AddPatentModalProps = {
  onClose: () => void;
  visible: boolean;
  patent: Patent;
}

export const EditPatentModal = (props: AddPatentModalProps) => {
  const {visible, onClose, patent} = props;

  const [trigger, response] = patentsApiSlice.useEditPatentMutation()
  const {data: patentTypes} = patentTypeApiSlice.useGetPatentTypesQuery('')
  const {data: technologyFields} = technologyFieldApiSlice.useGetTechnologyFieldsQuery('')
  const {data: institutes} = instituteApiSlice.useGetInstitutesQuery('')
  const {data: user} = userApiSlice.useGetMeQuery()

  const isAdmin = useIsAdmin()

  const availableInstitutes = institutes?.filter((institute) => {
    if (isAdmin) return true
    return institute.id === user?.institute?.id
  })

  useModalOverflow(visible)

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
          institutes={availableInstitutes}
          onSubmit={handleSubmit}
          formType="edit"
          patent={patent}
        />
      </div>
    </div>
  );
};
