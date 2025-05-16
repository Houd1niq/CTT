import React, {useState} from 'react';
import {Button} from '@shared/ui/Button/Button';
import {EditEmployeeModal} from '../AddEmployeeModal/EditEmployeeModal.tsx';
import styles from './EmployeeTable.module.scss';
import {adminApiSlice} from "@features/admin/api/adminApiSlice.ts";
import {UserResponse} from "@entities/user";
import {Employee} from "@features/admin/model/types.ts";

interface EmployeeTableProps {
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: number) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({onEdit, onDelete}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<UserResponse | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data: allUsers} = adminApiSlice.useGetUsersQuery();

  const handleEdit = (employee: UserResponse) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(undefined);
  };

  const handleModalSubmit = (formData: Employee) => {
    onEdit(formData);
    handleModalClose();
  };

  return (
    <>
      <div className={styles.employeesList}>
        <table className={styles.table}>
          <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>ФИО</th>
            <th>Роль</th>
            <th>Институт</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          {allUsers?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user?.fullName}</td>
              <td>{user.role.name}</td>
              <td>{user?.institute?.name || '-'}</td>
              <td className={styles.actions}>
                <Button
                  onClick={() => handleEdit(user)}
                  className={styles.editButton}
                >
                  Редактировать
                </Button>
                {user.role.name !== 'admin' && <Button
                  onClick={() => onDelete(user.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </Button>}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <EditEmployeeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={selectedEmployee}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};
