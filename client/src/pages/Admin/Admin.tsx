import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './Admin.module.scss';
import {EmployeeTable, AddEmployeeForm} from '@features/admin';
import {Employee} from "@features/admin/model/types.ts";
import {adminApiSlice} from "@features/admin/api/adminApiSlice.ts";
import {instituteApiSlice} from "@entities/institute";
import {DeleteModal} from "@shared/ui/DeleteModal/DeleteModal.tsx";

const Admin: React.FC = () => {
  const {data: roles} = adminApiSlice.useGetRolesQuery();
  const {data: institutes} = instituteApiSlice.useGetInstitutesQuery('');

  const [createEmployee] = adminApiSlice.useCreateEmployeeMutation();
  const [deleteEmployee] = adminApiSlice.useDeleteEmployeeMutation();
  const [editEmployee] = adminApiSlice.useEditEmployeeMutation();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false)
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState<number | null>(null)

  const handleAddEmployee = (employee: Employee) => {
    createEmployee(employee);
  };

  const handleEditEmployee = (employee: Employee) => {
    editEmployee(employee);
  };

  const handleDeleteEmployee = (employeeId: number) => {
    setIsDeleteModalVisible(true)
    setEmployeeIdToDelete(employeeId)
  };

  const submitDelete = () => {
    if (employeeIdToDelete) {
      deleteEmployee(employeeIdToDelete);
      setIsDeleteModalVisible(false)
    }
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.backLink}>
          На главную
        </Link>
        <h1>Панель администратора</h1>
      </div>

      <div className={styles.adminContent}>
        <AddEmployeeForm
          onSubmit={handleAddEmployee}
          roles={roles || []}
          institutes={institutes || []}
        />
        <EmployeeTable
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
        <DeleteModal
          visible={isDeleteModalVisible}
          onClose={() => {
            setIsDeleteModalVisible(false)
            setEmployeeIdToDelete(null)
          }}
          onSubmit={submitDelete}
          identifier={employeeIdToDelete}
          title="Вы действительно хотите удалить сотрудника с ID"
          name={employeeIdToDelete}
        />
      </div>
    </div>
  );
};

export default Admin;
