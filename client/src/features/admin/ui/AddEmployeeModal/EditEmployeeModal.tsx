import React from 'react';
import {AddEmployeeForm} from '../AddEmployeeForm/AddEmployeeForm';
import styles from './AddEmployeeModal.module.scss';
import {UserResponse} from "@entities/user";
import {instituteApiSlice} from "@entities/institute";
import {Employee} from "@features/admin/model/types.ts";
import {adminApiSlice} from "@features/admin/api/adminApiSlice.ts";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponse;
  onSubmit: (employee: Employee) => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = (props) => {
  const {isOpen, onClose, user, onSubmit} = props
  const {data: institutes} = instituteApiSlice.useGetInstitutesQuery('');
  const {data: roles} = adminApiSlice.useGetRolesQuery();


  if (!isOpen || !user) return null;

  const handleSubmit = (formData: Employee) => {
    onSubmit(formData);
    onClose();
  };

  const transformedUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    roleId: user.role.id,
    instituteId: user.institute?.id,
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{user ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <AddEmployeeForm
            onSubmit={handleSubmit}
            initialData={transformedUser}
            institutes={institutes || []}
            roles={roles || []}
          />
        </div>
      </div>
    </div>
  );
};
