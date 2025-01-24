import {ChangeEvent, useState, DragEvent, FormEvent} from "react";
import {Patent} from "../../../services/CTTApi/patentsApiSlice.ts";
import UploadIcon from '@assets/icons/icons8-upload-file-48.png'
import './patent-form.scss'

interface PatentFormProps {
  formType: 'add' | 'edit';
  onSubmit: (formData: FormData) => void;
  technologyFields?: { id: number; name: string }[];
  patentTypes?: { id: number; name: string }[];
  patent?: Patent;
}

export const PatentForm = (props: PatentFormProps) => {
  const {formType, onSubmit, technologyFields, patentTypes, patent} = props
  const [isPrivate, setIsPrivate] = useState<boolean>(patent?.isPrivate || false)
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

    onSubmit(formData)
  }

  return (
    <form className="patent-form" onSubmit={handleSubmit}>
      <div>
        <label className="patent-form-label">№ патента/свидетельства</label>
        <input
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
      <div>
        <label className="patent-form-label">Вид</label>
        <select
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
      <div>
        <label className="patent-form-label">Название</label>
        <input
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
      <div>
        <label className="patent-form-label">Дата регистрации</label>
        <input
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
      <div>
        <label className="patent-form-label">Область техники</label>
        <select
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
      <div>
        <label className="patent-form-label">Дата истечения патента</label>
        <input
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
      <div>
        <label className="patent-form-label">Контактное лицо</label>
        <input
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
      <button type="submit" className="patent-form-submit button">
        {formType === 'edit' ? 'Обновить патент' : 'Добавить патент'}
      </button>
    </form>
  );
};
