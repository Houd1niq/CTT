import {useAppDispatch} from "@shared/utils/hooks.ts";
import {ChangeEvent, useCallback} from "react";
import {debounce} from "@shared/utils/debounce.ts";
import {setSearchQuery} from "@features/patentSearch";
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
