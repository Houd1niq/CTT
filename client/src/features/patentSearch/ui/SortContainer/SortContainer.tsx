import React from "react";
import {useAppDispatch} from "@shared/utils/hooks.ts";
import {setPatentSort} from "@features/patentSearch";

import './sort-container.scss'

export const SortContainer = () => {
  const dispatch = useAppDispatch()

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = event.target.value as 'asc' | 'desc' | ';';
    dispatch(setPatentSort(newOrder));
  };


  return (
    <div className="sortContainer">
      <select
        onChange={handleSortChange}
      >
        <option value=''>Сортировать</option>
        <option value="asc">По возрастанию даты регистрации</option>
        <option value="desc">По убыванию даты регистрации</option>
      </select>
    </div>
  );
};
