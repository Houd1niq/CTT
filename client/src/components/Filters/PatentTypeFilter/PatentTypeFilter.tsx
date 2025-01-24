import {Filter} from "../Filter/Filter.tsx";
import {useAppDispatch} from "../../../store/hooks.ts";
import {removePatentTypeFilter, setPatentTypeFilter} from "../../../store/slices/searchSlice.ts";
import {FilterModal} from "../../Modals/FilterModal/FilterModal.tsx";
import {useEffect, useState} from "react";
import {userApiSlice} from "../../../services/CTTApi/userApiSlice.ts";
import {filtersApiSlice, FilterType} from "../../../services/CTTApi/filtersApiSlice.ts";
import {DeleteModal} from "../../Modals/DeleteModal/DeleteModal.tsx";

export const PatentTypeFilter = () => {
  const dispatch = useAppDispatch();

  const {currentData: user} = userApiSlice.useGetMeQuery()

  const {data: patentTypes} = filtersApiSlice.useGetPatentTypesQuery('');
  const [addTrigger, addResponse] = filtersApiSlice.useAddPatentTypeMutation()
  const [editTrigger, editResponse] = filtersApiSlice.useEditPatentTypeMutation()
  const [deleteTrigger, deleteResponse] = filtersApiSlice.useDeletePatentTypeMutation()
  const [getDeletable, deletableResponse] = filtersApiSlice.useLazyGetDeletablePatentTypesQuery()

  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<FilterType | null>(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<FilterType | null>(null)

  const handleSelect = (filterTypeId: number) => {
    dispatch(setPatentTypeFilter(filterTypeId));
  }

  const handleRemove = (filterTypeId: number) => {
    dispatch(removePatentTypeFilter(filterTypeId));
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
        title="По видам"
        options={patentTypes}
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
        title="вид патента"
        visible={filterModalVisible}
        onClose={closeFilterModal}
        onSubmit={submitHandler}/>}

      {deleteModalVisible && <DeleteModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onSubmit={deleteTrigger}
        name={itemToDelete?.name}
        identifier={itemToDelete?.id}
        title="Вы уверены, что хотите удалить тип патента"/>}
    </div>
  );
};
