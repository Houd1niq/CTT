import {useAppDispatch} from "../../store/hooks.ts";
import {ChangeEvent, useCallback} from "react";
import {setSearchQuery} from "../../store/slices/searchSlice.ts";
import {debounce} from "../../utils/debounce.ts";

import './search-field.scss'

export const SearchField = () => {
  const dispatch = useAppDispatch();
  const debouncedSearch = useCallback(debounce((event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  }, 800), []);

  return (
    <div className="search">
      <label className="searchLabel">Поиск</label>
      <input
        type="text"
        className="searchInput"
        placeholder="Введите для фильтрации"
        onChange={debouncedSearch}
      />
    </div>
  );
};
