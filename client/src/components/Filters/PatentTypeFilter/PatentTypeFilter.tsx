import {Filter} from "../Filter/Filter.tsx";
import {useAppDispatch} from "../../../store/hooks.ts";
import {removePatentTypeFilter, setPatentTypeFilter} from "../../../store/slices/searchSlice.ts";
import {patentsApiSlice} from "../../../services/CTTApi/patentsApiSlice.ts";

export const PatentTypeFilter = () => {
  const dispatch = useAppDispatch();

  const {data: patentTypes} = patentsApiSlice.useGetPatentTypesQuery('');

  const handleSelect = (filterTypeId: number) => {
    dispatch(setPatentTypeFilter(filterTypeId));
  }

  const handleRemove = (filterTypeId: number) => {
    dispatch(removePatentTypeFilter(filterTypeId));
  }

  return (
    <div>
      <Filter
        title="По видам"
        options={patentTypes}
        onSelect={handleSelect}
        onRemove={handleRemove}/>
    </div>
  );
};
