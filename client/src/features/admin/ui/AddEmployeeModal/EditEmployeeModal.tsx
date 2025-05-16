import React from 'react';
import {AddEmployeeForm} from '../AddEmployeeForm/AddEmployeeForm';
import styles from './AddEmployeeModal.module.scss';

interface Employee {
  id: number;
  email: string;
  fullName: string;
  role: string;
  institute: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee;
  onSubmit: (employee: Employee) => void;
}

export const EditEmployeeModal: React.FC<AddEmployeeModalProps> = (props) => {
  const {isOpen, onClose, employee, onSubmit} = props

  if (!isOpen) return null;

  const handleSubmit = (formData: Employee) => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{employee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <AddEmployeeForm onSubmit={handleSubmit} initialData={employee}/>
        </div>
      </div>
    </div>
  );
};
