import {Filter} from "@shared/ui/Filter/Filter.tsx";
import {useAppDispatch} from "@shared/utils/hooks.ts";
import {FilterModal} from "@shared/ui/FilterModal/FilterModal.tsx";
import {useEffect, useState} from "react";
import {userApiSlice} from "@entities/user/api/userApiSlice.ts";
import {DeleteModal} from "@shared/ui/DeleteModal/DeleteModal.tsx";
import {FilterType} from "@shared/types/common";
import {instituteApiSlice} from "@entities/institute";
import {removeInstituteFilter, setInstituteFilter} from "@features/patentSearch";

export const InstituteFilter = () => {
  const dispatch = useAppDispatch();

  const {currentData: user} = userApiSlice.useGetMeQuery()

  const {data: patentTypes} = instituteApiSlice.useGetInstitutesQuery('');
  const [addTrigger, addResponse] = instituteApiSlice.useAddInstituteMutation()
  const [editTrigger, editResponse] = instituteApiSlice.useEditInstituteMutation()
  const [deleteTrigger, deleteResponse] = instituteApiSlice.useDeleteInstituteMutation()
  const [getDeletable, deletableResponse] = instituteApiSlice.useLazyGetDeletableInstitutesQuery()

  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<FilterType | null>(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<FilterType | null>(null)

  const handleSelect = (filterTypeId: number) => {
    dispatch(setInstituteFilter(filterTypeId));
  }

  const handleRemove = (filterTypeId: number) => {
    dispatch(removeInstituteFilter(filterTypeId));
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
        title="По институтам"
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

      <FilterModal
        contentToEdit={itemToEdit ? itemToEdit : undefined}
        title="институт"
        visible={filterModalVisible}
        onClose={closeFilterModal}
        onSubmit={submitHandler}/>

      <DeleteModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onSubmit={deleteTrigger}
        name={itemToDelete?.name}
        identifier={itemToDelete?.id}
        title="Вы уверены, что хотите удалить институт"/>
    </div>
  );
};
