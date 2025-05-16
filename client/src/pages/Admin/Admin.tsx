import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Admin.module.scss';
import {EmployeeTable, AddEmployeeForm} from '@features/admin';
import {Employee} from "@features/admin/model/types.ts";
import {adminApiSlice} from "@features/admin/api/adminApiSlice.ts";
import {instituteApiSlice} from "@entities/institute";

const Admin: React.FC = () => {
  const {data: roles} = adminApiSlice.useGetRolesQuery();
  const {data: institutes} = instituteApiSlice.useGetInstitutesQuery('');

  const [createEmployee] = adminApiSlice.useCreateEmployeeMutation();

  const handleAddEmployee = (employee: Employee) => {
    // TODO: Implement edit functionality
    createEmployee(employee);
  };

  const handleEditEmployee = (employee: Employee) => {
    // TODO: Implement edit functionality
    console.log('Edit employee:', employee);
  };

  const handleDeleteEmployee = (employeeId: number) => {
    // TODO: Implement delete functionality
    console.log('Delete employee:', employeeId);
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
        <AddEmployeeForm
          onSubmit={handleAddEmployee}
          roles={roles || []}
          institutes={institutes || []}
        />
        <EmployeeTable
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      </div>
    </div>
  );
};

export default Admin;
