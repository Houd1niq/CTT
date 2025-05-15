import React from "react";

interface PatentCardProps {
  data?: Patent;
  onDelete: (id: number, name: string) => void
  onEdit: (patent: Patent) => void
  isActionsGranted?: boolean
}

import './patent-card.scss'
import {Patent} from "@entities/patent/model/types.ts";
import {Button} from "@/shared/ui/Button/Button";

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
    {label: 'Институт', value: patent.institute.name},
    {label: 'Контакты', value: patent.contact},
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
          <Button className="editButton" onClick={() => onEdit(data)}>
            Изменить
          </Button>
          <Button className="deleteButton" onClick={() => onDelete(data.id, data.name)}>
            Удалить
          </Button>
        </div>}

        {(!data.isPrivate) && <Button
          onClick={() => {
            window.open(`${import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin}/files/${data.patentLink}`, '_blank')
          }}
          className="moreButtonCard">Подробнее</Button>}
      </div>

    </div>
  );
};
