import React from 'react';
import { Button } from '@shared/ui/Button/Button';
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

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
  return (
    <div className={styles.employeesList}>
      <h2>Список сотрудников</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>ID</th>
            <th className={styles.tableHeader}>Email</th>
            <th className={styles.tableHeader}>ФИО</th>
            <th className={styles.tableHeader}>Роль</th>
            <th className={styles.tableHeader}>Институт</th>
            <th className={styles.tableHeader}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.email}</td>
              <td>{employee.fullName}</td>
              <td>{employee.role}</td>
              <td>{employee.institute}</td>
              <td className={styles.actionsCell}>
                <Button 
                  onClick={() => onEdit(employee)}
                  className={styles.editButton}
                >
                  Изменить
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
  );
}; 