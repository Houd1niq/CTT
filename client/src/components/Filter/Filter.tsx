import React from "react";
import {FilterType} from "../../services/CTTApi/patentsApiSlice.ts";

interface FilterProps {
  title: string;
  options?: FilterType[];
  onSelect: (filterType: number) => void;
  onRemove: (filterType: number) => void;
}

export const Filter: React.FC<FilterProps> = ({title, options, onRemove, onSelect}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, option: FilterType) => {
    if (e.target.checked) {
      onSelect(option.id)
    } else {
      onRemove(option.id)
    }
  }

  return (
    <div className="filterSection">
      <div className="filterTitle">{title}</div>
      {options?.map((option) => (
        <div className="filterOption" key={option.id}>
          <label>
            <input
              onChange={(e) => handleChange(e, option)}
              type="checkbox"/>
            <span>{option.name}</span>
          </label>
        </div>
      ))}
    </div>
  )
};
