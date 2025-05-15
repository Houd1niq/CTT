import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Admin.module.scss';
import { Button } from '@shared/ui/Button/Button';
import { Input } from '@shared/ui/Input/Input';

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
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    fullName: '',
    role: '',
    institute: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmployee.password !== newEmployee.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    // TODO: Add API call to create employee
    setEmployees(prev => [...prev, { ...newEmployee, id: Date.now() }]);
    setNewEmployee({ 
      email: '', 
      fullName: '', 
      role: '', 
      institute: '',
      password: '',
      confirmPassword: '',
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        <div className={styles.addEmployeeForm}>
          <h2>Добавить сотрудника</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formContent}>
              <Input
                title="Email"
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                required
              />

              <Input
                title="ФИО"
                type="text"
                name="fullName"
                value={newEmployee.fullName}
                onChange={handleInputChange}
                required
              />

              <div className={styles.formGroup}>
                <label htmlFor="role">Роль:</label>
                <select
                  id="role"
                  name="role"
                  value={newEmployee.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите роль</option>
                  <option value="admin">Администратор</option>
                  <option value="manager">Менеджер</option>
                  <option value="user">Пользователь</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="institute">Институт:</label>
                <select
                  id="institute"
                  name="institute"
                  value={newEmployee.institute}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите институт</option>
                  {institutes.map((institute) => (
                    <option key={institute} value={institute}>
                      {institute}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.passwordGroup}>
                <Input
                  title="Пароль"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={newEmployee.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <div className={styles.passwordGroup}>
                <Input
                  title="Подтверждение пароля"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={newEmployee.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <Button type="submit" className={styles.submitButton}>
              Добавить сотрудника
            </Button>
          </form>
        </div>

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
                      onClick={() => {/* TODO: Add edit functionality */}}
                      className={styles.editButton}
                    >
                      Изменить
                    </Button>
                    <Button 
                      onClick={() => {/* TODO: Add delete functionality */}}
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
      </div>
    </div>
  );
};

export default Admin; 