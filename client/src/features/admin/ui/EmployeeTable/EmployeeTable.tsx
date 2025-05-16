import React, {useState} from 'react';
import {Button} from '@shared/ui/Button/Button';
import {EditEmployeeModal} from '../AddEmployeeModal/EditEmployeeModal.tsx';
import styles from './EmployeeTable.module.scss';

interface Employee {
  id: number;
  email: string;
  fullName: string;
  role: string;
  institute: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    email: 'ivanov@ystu.ru',
    fullName: 'Иванов Иван Иванович',
    role: 'Администратор',
    institute: 'Институт машиностроения'
  },
  {
    id: 2,
    email: 'petrov@ystu.ru',
    fullName: 'Петров Петр Петрович',
    role: 'Менеджер',
    institute: 'Институт информационных технологий'
  },
  {
    id: 3,
    email: 'sidorov@ystu.ru',
    fullName: 'Сидоров Сидор Сидорович',
    role: 'Пользователь',
    institute: 'Институт экономики и управления'
  },
  {
    id: 4,
    email: 'smirnova@ystu.ru',
    fullName: 'Смирнова Анна Петровна',
    role: 'Менеджер',
    institute: 'Институт гуманитарных наук'
  },
  {
    id: 5,
    email: 'kuznetsov@ystu.ru',
    fullName: 'Кузнецов Алексей Николаевич',
    role: 'Пользователь',
    institute: 'Институт строительства и архитектуры'
  }
];

export const EmployeeTable: React.FC<EmployeeTableProps> = ({onEdit, onDelete}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (employee: Employee) => {
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
          {mockEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.email}</td>
              <td>{employee.fullName}</td>
              <td>{employee.role}</td>
              <td>{employee.institute}</td>
              <td className={styles.actions}>
                <Button
                  onClick={() => handleEdit(employee)}
                  className={styles.editButton}
                >
                  Редактировать
                </Button>
                <Button
                  onClick={() => onDelete(employee)}
                  className={styles.deleteButton}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <EditEmployeeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        employee={selectedEmployee}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};
