import {ChangeEvent, useState, DragEvent} from "react";
import {Patent} from "../../../services/CTTApi/patentsApiSlice.ts";

interface PatentFormProps {
  formType: 'add' | 'edit';
  onSubmit: (formData: FormData) => void;
  technologyFields?: { id: number; name: string }[];
  patentTypes?: { id: number; name: string }[];
  patent?: Patent;
}

export const PatentForm = (props: PatentFormProps) => {
  const {formType, onSubmit, technologyFields, patentTypes, patent} = props
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [technologyFieldId, setTechnologyFieldId] = useState<number>(patent?.technologyField.id || 1)
  const [patentTypeId, setPatentTypeId] = useState<number>(patent?.patentType.id || 1)
  const [patentNumber, setPatentNumber] = useState<string>(patent?.patentNumber || '')
  const [patentName, setPatentName] = useState<string>(patent?.name || '')
  const [patentDateOfRegistration, setPatentDateOfRegistration] = useState<string>(patent?.dateOfRegistration || '')
  const [patentDateOfExpiration, setPatentDateOfExpiration] = useState<string>(patent?.dateOfExpiration || '')
  const [contact, setContact] = useState<string>(patent?.contact || '')

  const [file, setFile] = useState<File | null>(null)

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) setFile(files[0]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) setFile(event.target.files[0]);
  };

  return (
    <form className="patent-form" onSubmit={e => {
      e.preventDefault()
      const formData = new FormData()
      formData.append('patentFile', file as Blob)
      formData.append('isPrivate', isPrivate.toString())
      formData.append('patentNumber', patentNumber)
      formData.append('patentTypeId', patentTypeId.toString())
      formData.append('name', patentName)
      formData.append('dateOfRegistration', patentDateOfRegistration)
      formData.append('technologyFieldId', technologyFieldId.toString())
      formData.append('dateOfExpiration', patentDateOfExpiration)
      formData.append('contact', contact)

      onSubmit(formData)
    }}>
      <div>
        <label className="popupLabel">№ патента/свидетельства</label>
        <input
          type="text"
          className="popupInput"
          name="patentNumber"
          value={patentNumber}
          required
          onChange={(e) => {
            setPatentNumber(e.target.value);
          }}
        />
      </div>
      <div className="form-select-wrapper">
        <label className="popupLabel">Вид</label>
        <select
          className="popupInput"
          value={patentTypeId}
          onChange={(e) => {
            setPatentTypeId(Number(e.target.value));
          }}
        >
          {patentTypes?.map(patentType => (
            <option key={patentType.id} value={patentType.id}>{patentType.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="popupLabel">Название</label>
        <input
          type="text"
          className="popupInput"
          name="name"
          value={patentName}
          required
          onChange={(e) => {
            setPatentName(e.target.value);
          }}
        />
      </div>
      <div>
        <label className="popupLabel">Дата регистрации</label>
        <input
          type="date"
          className="popupInput"
          name="dateOfRegistration"
          value={patentDateOfRegistration.split('T')[0]}
          required
          onChange={(e) => {
            setPatentDateOfRegistration(e.target.value);
          }}
        />
      </div>
      <div>
        <label className="popupLabel">Область техники</label>
        <select
          className="popupInput"
          value={technologyFieldId}
          onChange={(e) => {
            setTechnologyFieldId(Number(e.target.value));
          }}
        >
          {technologyFields?.map(technologyField => (
            <option key={technologyField.id} value={technologyField.id}>{technologyField.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="popupLabel">Дата истечения патента</label>
        <input
          type="date"
          className="popupInput"
          name="dateOfExpiration"
          value={patentDateOfExpiration.split('T')[0]}
          required
          onChange={(e) => {
            setPatentDateOfExpiration(e.target.value);
          }}
        />
      </div>
      <div>
        <label className="popupLabel">Контактное лицо</label>
        <input
          type="text"
          className="popupInput"
          name="contact"
          value={contact}
          required
          onChange={(e) => {
            setContact(e.target.value);
          }}
        />
      </div>
      <div>
        <label className="checkboxPrivate">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Приватный
        </label>
      </div>
      {formType !== 'edit' && (
        <div
          className="fileUpload"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="fileUploadContent">
            <img
              src="../../../public/icons8-upload-file-48.png"
              alt="Upload Icon"
              className="uploadIcon"
            />
            <p className="uploadText">Перетащите файл сюда</p>
            <p className="orText">или</p>
            <label htmlFor="fileUpload" className="browseButton">
              Выберите файл
            </label>
            <input
              type="file"
              id="fileUpload"
              className="fileInput"
              onChange={handleFileChange}
              required
            />
            {file && <hr className="fileSeparator"/>}
            <div className="uploadedFileName">{file?.name}</div>
          </div>
        </div>
      )}
      {/*<div className="popupButtons">*/}
      {/*  <button*/}
      {/*    type="button"*/}
      {/*    className="closePopup"*/}
      {/*    onClick={() => handleCloseAddPopup(false)}*/}
      {/*  >*/}
      {/*    Закрыть*/}
      {/*  </button>*/}
      <button type="submit" className="popupSubmit">
        {formType === 'edit' ? 'Обновить патент' : 'Добавить патент'}
      </button>
    </form>
  );
};
