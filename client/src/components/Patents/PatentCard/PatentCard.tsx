import React from "react";
import {Patent} from "../../../services/CTTApi/patentsApiSlice.ts";

interface PatentCardProps {
  data?: Patent;
  onDelete: (id: number, name: string) => void
  onEdit: (patent: Patent) => void
  isActionsGranted?: boolean
}

import './patent-card.scss'

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU');
};

const generatePatentContent = (patent: Patent) => {
  return [
    {label: '№ патента/свидетельства', value: patent.patentNumber},
    {label: 'Вид', value: patent.patentType.name},
    {label: 'Название', value: patent.name,},
    {label: 'Дата регистрации', value: formatDate(patent.dateOfRegistration)},
    {label: 'Область техники', value: patent.technologyField.name},
  ]
}

export const PatentCard: React.FC<PatentCardProps> = (props) => {
  const {
    data,
    onDelete,
    onEdit,
    isActionsGranted
  } = props

  if (!data) return null

  return (
    <div className="card">

      <div className="cardContent">
        {generatePatentContent(data).map(({label, value}) => (
          <div className="cardRow" key={label}>
            <span className="label">{label}</span>
            <span className="value">{value}</span>
          </div>
        ))}
      </div>

      <div className="buttonsCard">
        {isActionsGranted && <div className="adminButtons">
          <button className="button editButton" onClick={() => onEdit(data)}>
            Изменить
          </button>
          <button className="button deleteButton" onClick={() => onDelete(data.id, data.name)}>
            Удалить
          </button>
        </div>}

        {(!data.isPrivate) && <button
          onClick={() => {
            window.open(`http://localhost:5000/files/${data.patentLink}`, '_blank')
          }}
          className="button moreButtonCard">Подробнее</button>}
      </div>

    </div>
  );
};
