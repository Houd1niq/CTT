import {ChangeEvent, useState, DragEvent, FormEvent} from "react";
import UploadIcon from '@shared/assets/icons/icons8-upload-file-48.png'
import {Patent} from "@entities/patent";
import './patent-form.scss'
import {Button} from "@shared/ui/Button/Button.tsx";

interface PatentFormProps {
  formType: 'add' | 'edit';
  onSubmit: (formData: FormData) => void;
  technologyFields?: { id: number; name: string }[];
  patentTypes?: { id: number; name: string }[];
  institutes?: { id: number; name: string }[];
  patent?: Patent;
}

export const PatentForm = (props: PatentFormProps) => {
  const {formType, onSubmit, technologyFields, patentTypes, patent, institutes} = props
  const [isPrivate, setIsPrivate] = useState<boolean>(patent?.isPrivate || false)
  const [technologyFieldId, setTechnologyFieldId] = useState<number>(patent?.technologyField.id || 1)
  const [patentTypeId, setPatentTypeId] = useState<number>(patent?.patentType.id || 1)
  const [instituteId, setInstituteId] = useState<number>(patent?.institute.id || 1)
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
    formData.append('instituteId', instituteId.toString())

    onSubmit(formData)
  }

  return (
    <form className="patent-form" onSubmit={handleSubmit}>
      <div className="patent-form-field">
        <label className="patent-form-label" htmlFor="patentNumber">№ патента/свидетельства</label>
        <input
          id="patentNumber"
          type="text"
          className="patent-form-input"
          name="patentNumber"
          value={patentNumber}
          required
          onChange={(e) => {
            setPatentNumber(e.target.value);
          }}
        />
      </div>
      <div className="patent-form-field">
        <label className="patent-form-label" htmlFor="patentName">Название</label>
        <input
          id="patentName"
          type="text"
          className="patent-form-input"
          name="name"
          value={patentName}
          required
          onChange={(e) => {
            setPatentName(e.target.value);
          }}
        />
      </div>
      <div className="patent-form-field">
        <label className="patent-form-label" htmlFor="technologyField">Область техники</label>
        <select
          id="technologyField"
          className="patent-form-input"
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
      <div className="patent-form-field">
        <label className="patent-form-label" htmlFor="patentType">Вид</label>
        <select
          id="patentType"
          className="patent-form-input"
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
      <div className="patent-form-field">
        <label className="patent-form-label" htmlFor="institute">Институт</label>
        <select
          id="institute"
          className="patent-form-input"
          value={instituteId}
          onChange={(e) => {
            setInstituteId(Number(e.target.value));
          }}
        >
          {institutes?.map(institute => (
            <option key={institute.id} value={institute.id}>{institute.name}</option>
          ))}
        </select>

      </div>
      <div className="patent-form-field">
        <label className="patent-form-label" htmlFor="dateOfRegistration">Дата регистрации</label>
        <input
          id="dateOfRegistration"
          type="date"
          className="patent-form-input"
          name="dateOfRegistration"
          value={patentDateOfRegistration.split('T')[0]}
          required
          onChange={(e) => {
            setPatentDateOfRegistration(e.target.value);
          }}
        />
      </div>
      <div className="patent-form-field">
        <label className="patent-form-label" htmlFor="dateOfExpiration">Дата истечения патента</label>
        <input
          id="dateOfExpiration"
          type="date"
          className="patent-form-input"
          name="dateOfExpiration"
          value={patentDateOfExpiration.split('T')[0]}
          required
          onChange={(e) => {
            setPatentDateOfExpiration(e.target.value);
          }}
        />
      </div>
      <div className="patent-form-field">
        <label className="patent-form-label" htmlFor="contact">Контактное лицо</label>
        <input
          id="contact"
          type="text"
          className="patent-form-input"
          name="contact"
          value={contact}
          required
          onChange={(e) => {
            setContact(e.target.value);
          }}
        />
      </div>
      <div className="patent-form-field">
        <label className="checkboxPrivate" htmlFor="isPrivate">
          <input
            id="isPrivate"
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
              src={UploadIcon}
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
      <Button type="submit" className="patent-form-submit">
        {formType === 'edit' ? 'Обновить патент' : 'Добавить патент'}
      </Button>
    </form>
  );
};
