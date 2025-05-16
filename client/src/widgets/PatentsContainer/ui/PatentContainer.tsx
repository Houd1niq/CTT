import {patentsApiSlice} from "@entities/patent/api/patentsApiSlice.ts";
import {PatentCard} from "@entities/patent/ui/PatentCard/PatentCard.tsx";
import {userApiSlice} from "@entities/user/api/userApiSlice.ts";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector, useIsAdmin} from "@shared/utils/hooks.ts";
import {EditPatentModal} from "@features/patentManagement/ui/EditPatentModal/EditPatentModal.tsx";
import {DeleteModal} from "@shared/ui/DeleteModal/DeleteModal.tsx";
import {setTotalPages} from "@features/patentSearch/model/searchSlice.ts";
import {BeatLoader} from "react-spinners";
import './patent-container.scss'
import {technologyFieldApiSlice} from "@entities/technologyField/api/technologyFieldApiSlice.ts";
import {patentTypeApiSlice} from "@entities/patentType/api/patentTypeApiSlice.ts";
import {Patent} from "@entities/patent";
import {instituteApiSlice} from "@entities/institute";

type PatentContainerProps = {
  className?: string;
}

export const PatentContainer = (props: PatentContainerProps) => {
  const {
    className,
  } = props;

  const {currentData: user} = userApiSlice.useGetMeQuery()
  const dispatch = useAppDispatch()

  const [patents, setPatents] = useState<Patent[]>([])
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

  const [patentToEdit, setPatentToEdit] = useState<Patent | undefined>()
  const [patentToDelete, setPatentToDelete] = useState<Patent | undefined>()

  const [fetchPatents, patentsResponse] = patentsApiSlice.useLazyGetPatentsQuery()
  const [fetchPatentsSearch, patentsSearchResponse] = patentsApiSlice.useLazySearchPatentsQuery()
  const [deleteTrigger, deleteResponse] = patentsApiSlice.useDeletePatentMutation()

  const technologyFieldsFilter = useAppSelector(state => state.searchReducer.technologyFieldFilters)
  const patentTypeFilters = useAppSelector(state => state.searchReducer.patentTypeFilters)
  const instituteFilters = useAppSelector(state => state.searchReducer.instituteFilters)
  const patentSort = useAppSelector(state => state.searchReducer.patentSort)
  const searchQuery = useAppSelector(state => state.searchReducer.searchQuery)
  const page = useAppSelector(state => state.searchReducer.page)

  const {isLoading: patentTypesIsLoading} = patentTypeApiSlice.useGetPatentTypesQuery('')
  const {isLoading: technologyFieldsIsLoading} = technologyFieldApiSlice.useGetTechnologyFieldsQuery('')
  const {isLoading: institutesIsLoading} = instituteApiSlice.useGetInstitutesQuery('')

  const isAdmin = useIsAdmin()

  useEffect(() => {
    if ((!patentTypesIsLoading || !patentTypeFilters.length)
      && (!technologyFieldsIsLoading || !technologyFieldsFilter.length)
      && (!institutesIsLoading || !instituteFilters.length)) {

      if (searchQuery) {
        fetchPatentsSearch({
          query: searchQuery,
          sort: patentSort,
          technologyFieldId: technologyFieldsFilter,
          patentTypeId: patentTypeFilters,
          instituteId: instituteFilters
        })
      } else {
        fetchPatents({
          technologyFieldId: technologyFieldsFilter,
          patentTypeId: patentTypeFilters,
          instituteId: instituteFilters,
          sort: patentSort,
          page: page
        })
      }
    }
  }, [technologyFieldsFilter, patentTypeFilters, instituteFilters, institutesIsLoading, patentTypesIsLoading, technologyFieldsIsLoading, patentSort, searchQuery, page]);

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

  useEffect(() => {
    if ((deleteResponse.isSuccess && !deleteResponse.isLoading) || (deleteResponse.isError && !deleteResponse.isLoading)) {
      closeDeleteModal();
    }
  }, [deleteResponse.isError, deleteResponse.isSuccess]);

  // @ts-ignore
  const isLoading = (patentsResponse.isFetching && !searchQuery) || (patentsSearchResponse.isFetching && searchQuery)

  const closeDeleteModal = () => {
    setIsDeletePopupOpen(false)
    setPatentToDelete(undefined)
  }

  return (
    <>
      <div className={className}>
        {isLoading ? <div className="loader-container"><BeatLoader/></div> : patents?.map(patent => {
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
            isActionsGranted={isAdmin || user?.institute?.id === patent.institute.id}
            key={patent.patentNumber}/>
        })}
      </div>

      {patentToEdit &&
        <EditPatentModal onClose={() => setIsEditPopupOpen(false)} visible={isEditPopupOpen} patent={patentToEdit}/>
      }

      {/*{patentToDelete &&*/}
      <DeleteModal<string>
        key="delete"
        identifier={patentToDelete?.patentNumber}
        name={patentToDelete?.name}
        visible={isDeletePopupOpen}
        title="Вы действительно уверены, что хотите удалить патент"
        onSubmit={deleteTrigger}
        onClose={closeDeleteModal}/>
    </>
  );
};
