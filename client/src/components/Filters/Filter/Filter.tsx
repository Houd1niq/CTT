import React from "react";
import './filter.scss'
import AddIcon from '@assets/icons/add.svg?react'
import EditIcon from '@assets/icons/edit.svg?react'
import DeleteIcon from '@assets/icons/delete.svg?react'
import {FilterType} from "../../../services/CTTApi/filtersApiSlice.ts";

interface FilterProps {
  title: string;
  options?: FilterType[];
  onSelect: (filterType: number) => void;
  onRemove: (filterType: number) => void;
  isActionVisible?: boolean
  onAdd?: () => void;
  onEdit?: (name: string, id: number) => void;
  onDelete?: (name: string, id: number) => void;
  deletable?: FilterType[];
}

export const Filter: React.FC<FilterProps> = (props) => {
  const {title, options, onRemove, onSelect, isActionVisible, onAdd, onEdit, deletable, onDelete} = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, option: FilterType) => {
    if (e.target.checked) {
      onSelect(option.id)
    } else {
      onRemove(option.id)
    }
  }

  return (
    <div className="filterSection">
      <div className="filterTitle">
        {title}
        {isActionVisible && <button onClick={onAdd}>
          <AddIcon className="icon"/>
        </button>}
      </div>
      {options?.map((option) => (
        <div className="filterOption" key={option.id}>
          <label>
            <input
              onChange={(e) => handleChange(e, option)}
              type="checkbox"/>
            <span>{option.name}</span>
          </label>
          {isActionVisible && <div className="action-buttons">
            <button onClick={() => onEdit?.(option.name, option.id)}>
              <EditIcon className="icon"/>
            </button>
            {deletable && deletable.find(item => item.id === option.id) &&
              <button onClick={() => onDelete?.(option.name, option.id)}>
                <DeleteIcon className="icon"/>
              </button>}
          </div>}
        </div>
      ))}
    </div>
  )
};
