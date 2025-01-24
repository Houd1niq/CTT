import {Filter} from "../Filter/Filter.tsx";
import {useAppDispatch} from "../../../store/hooks.ts";
import {
  removeTechnologyFieldFilter,
  setTechnologyFieldFilter
} from "../../../store/slices/searchSlice.ts";
import {filtersApiSlice, FilterType} from "../../../services/CTTApi/filtersApiSlice.ts";
import {useEffect, useState} from "react";
import {userApiSlice} from "../../../services/CTTApi/userApiSlice.ts";
import {FilterModal} from "../../Modals/FilterModal/FilterModal.tsx";
import {DeleteModal} from "../../Modals/DeleteModal/DeleteModal.tsx";

export const TechnologyFieldFilter = () => {
  const dispatch = useAppDispatch();

  const {data: user} = userApiSlice.useGetMeQuery()

  const {data: technologyFields} = filtersApiSlice.useGetTechnologyFieldsQuery('');
  const [addTrigger, addResponse] = filtersApiSlice.useAddTechnologyFieldMutation()
  const [editTrigger, editResponse] = filtersApiSlice.useEditTechnologyFieldMutation()
  const [deleteTrigger, deleteResponse] = filtersApiSlice.useDeleteTechnologyFieldMutation()
  const [getDeletable, deletableResponse] = filtersApiSlice.useLazyGetDeletableTechnologyFieldsQuery()

  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<FilterType | null>(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<FilterType | null>(null)

  const handleSelect = (filterTypeId: number) => {
    dispatch(setTechnologyFieldFilter(filterTypeId));
  }

  const handleRemove = (filterTypeId: number) => {
    dispatch(removeTechnologyFieldFilter(filterTypeId));
  }

  const closeFilterModal = () => {
    setFilterModalVisible(false)
    setItemToEdit(null)
  }

  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setItemToDelete(null)
  }

  useEffect(() => {
    if ((!addResponse.isLoading && (addResponse.isSuccess || addResponse.isError))
      || (!editResponse.isLoading && (editResponse.isSuccess || editResponse.isError))) {
      closeFilterModal()
    }
  }, [addResponse, editResponse]);

  useEffect(() => {
    if ((!deleteResponse.isLoading && (deleteResponse.isSuccess || deleteResponse.isError))) {
      closeDeleteModal()
    }
  }, [deleteResponse]);

  useEffect(() => {
    if (user && user.id) {
      getDeletable()
    }
  }, [user]);

  const submitHandler = itemToEdit ? editTrigger : addTrigger

  return (
    <div>
      <Filter
        title="По области техники"
        options={technologyFields}
        onSelect={handleSelect}
        onRemove={handleRemove}
        onAdd={() => setFilterModalVisible(true)}
        onEdit={(name: string, id: number) => {
          setFilterModalVisible(true)
          setItemToEdit({name, id})
        }}
        onDelete={(name, id) => {
          setDeleteModalVisible(true)
          setItemToDelete({name, id})
        }}
        deletable={deletableResponse.data}
        isActionVisible={Boolean(user)}
      />

      {filterModalVisible && <FilterModal
        contentToEdit={itemToEdit ? itemToEdit : undefined}
        title="область техники"
        visible={filterModalVisible}
        onClose={closeFilterModal}
        onSubmit={submitHandler}/>}

      {deleteModalVisible && <DeleteModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onSubmit={deleteTrigger}
        name={itemToDelete?.name}
        identifier={itemToDelete?.id}
        title="Вы уверены, что хотите удалить обалсть техники"/>}
    </div>
  );
};
