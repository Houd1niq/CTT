import {Patent, patentsApiSlice} from "../../../services/CTTApi/patentsApiSlice.ts";
import {PatentCard} from "../PatentCard/PatentCard.tsx";
import {userApiSlice} from "../../../services/CTTApi/userApiSlice.ts";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {EditPatentModal} from "../../Modals/EditPatentModal/EditPatentModal.tsx";
import {DeleteModal} from "../../Modals/DeleteModal/DeleteModal.tsx";
import {setTotalPages} from "../../../store/slices/searchSlice.ts";
import {BeatLoader} from "react-spinners";

type PatentContainerProps = {
  className?: string;
}

export const PatentContainer = (props: PatentContainerProps) => {
  const {
    className,
  } = props;

  const {data: user} = userApiSlice.useGetMeQuery(undefined)
  const dispatch = useAppDispatch()

  const [patents, setPatents] = useState<Patent[]>([])
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

  const [patentToEdit, setPatentToEdit] = useState<Patent | undefined>()
  const [patentToDelete, setPatentToDelete] = useState<Patent | undefined>()

  const [fetchPatents, patentsResponse] = patentsApiSlice.useLazyGetPatentsQuery()
  const [fetchPatentsSearch, patentsSearchResponse] = patentsApiSlice.useLazySearchPatentsQuery()

  const technologyFieldsFilter = useAppSelector(state => state.searchReducer.technologyFieldFilters)
  const patentTypeFilters = useAppSelector(state => state.searchReducer.patentTypeFilters)
  const patentSort = useAppSelector(state => state.searchReducer.patentSort)
  const searchQuery = useAppSelector(state => state.searchReducer.searchQuery)
  const page = useAppSelector(state => state.searchReducer.page)

  const {isLoading: patentTypesIsLoading} = patentsApiSlice.useGetPatentTypesQuery('')
  const {isLoading: technologyFieldsIsLoading} = patentsApiSlice.useGetTechnologyFieldsQuery('')

  const isAdmin = Boolean(user?.id)

  useEffect(() => {
    if ((!patentTypesIsLoading || !patentTypeFilters.length) && (!technologyFieldsIsLoading || !technologyFieldsFilter.length)) {

      if (searchQuery) {
        fetchPatentsSearch({
          query: searchQuery,
          sort: patentSort,
          technologyFieldId: technologyFieldsFilter,
          patentTypeId: patentTypeFilters,
        })
      } else {
        fetchPatents({
          technologyFieldId: technologyFieldsFilter,
          patentTypeId: patentTypeFilters,
          sort: patentSort,
          page: page
        })
      }
    }
  }, [technologyFieldsFilter, patentTypeFilters, patentTypesIsLoading, technologyFieldsIsLoading, patentSort, searchQuery, page]);

  useEffect(() => {
    if (searchQuery) {
      if (patentsSearchResponse.data) {
        setPatents(patentsSearchResponse.data)
      }
    } else {
      if (patentsResponse.data) {
        setPatents(patentsResponse.data.patents)
        dispatch(setTotalPages(patentsResponse.data.totalPages))
      }
    }
  }, [patentsResponse, patentsSearchResponse, searchQuery]);

  if ((patentsResponse.isFetching && !searchQuery) || (patentsSearchResponse.isFetching && searchQuery)) {
    return <div className="loader-container"><BeatLoader/></div>
  }

  return (
    <>
      <div className={className}>
        {patents?.map(patent => {
          return <PatentCard
            onDelete={() => {
              setPatentToDelete(patent)
              setIsDeletePopupOpen(true)
            }}
            onEdit={() => {
              setPatentToEdit(patent)
              setIsEditPopupOpen(true)
            }}
            data={patent}
            isActionsGranted={isAdmin}
            key={patent.patentNumber}/>
        })}
      </div>
      {patentToEdit &&
        <EditPatentModal onClose={() => setIsEditPopupOpen(false)} visible={isEditPopupOpen} patent={patentToEdit}/>
      }
      {patentToDelete &&
        <DeleteModal
          patentToDelete={patentToDelete}
          visible={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}/>}
    </>
  );
};