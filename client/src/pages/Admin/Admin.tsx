import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Admin.module.scss';
import { EmployeeTable, AddEmployeeForm } from '@features/admin';

interface Employee {
  id: number;
  email: string;
  fullName: string;
  role: string;
  institute: string;
}

const institutes = [
  'Институт машиностроения',
  'Институт менеджмента',
  'Институт информационных технологий',
  'Институт экономики и управления',
  'Институт гуманитарных наук',
  'Институт строительства и архитектуры',
  'Институт химии и химической технологии',
  'Институт энергетики и автоматизации',
];

const Admin: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleAddEmployee = (employeeData: Omit<Employee, 'id'>) => {
    // TODO: Add API call to create employee
    setEmployees(prev => [...prev, { ...employeeData, id: Date.now() }]);
  };

  const handleEditEmployee = (employee: Employee) => {
    // TODO: Implement edit functionality
    console.log('Edit employee:', employee);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    // TODO: Implement delete functionality
    console.log('Delete employee:', employee);
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.backLink}>
          На главную
        </Link>
        <h1>Управление сотрудниками</h1>
      </div>
      
      <div className={styles.adminContent}>
        <AddEmployeeForm onSubmit={handleAddEmployee} />
        <EmployeeTable 
          employees={employees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      </div>
    </div>
  );
};

export default Admin; 