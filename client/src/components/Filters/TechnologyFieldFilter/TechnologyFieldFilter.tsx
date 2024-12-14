import {Filter} from "../Filter/Filter.tsx";
import {useAppDispatch} from "../../../store/hooks.ts";
import {
  removeTechnologyFieldFilter,
  setTechnologyFieldFilter
} from "../../../store/slices/searchSlice.ts";
import {patentsApiSlice} from "../../../services/CTTApi/patentsApiSlice.ts";

export const TechnologyFieldFilter = () => {
  const dispatch = useAppDispatch();

  const {data: technologyFields} = patentsApiSlice.useGetTechnologyFieldsQuery('');

  const handleSelect = (filterTypeId: number) => {
    dispatch(setTechnologyFieldFilter(filterTypeId));
  }

  const handleRemove = (filterTypeId: number) => {
    dispatch(removeTechnologyFieldFilter(filterTypeId));
  }

  return (
    <div>
      <Filter
        title="По области техники"
        options={technologyFields}
        onSelect={handleSelect}
        onRemove={handleRemove}/>
    </div>
  );
};
