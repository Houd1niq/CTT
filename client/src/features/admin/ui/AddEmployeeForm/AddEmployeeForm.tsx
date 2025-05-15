import React, { useState } from 'react';
import { Button } from '@shared/ui/Button/Button';
import { Input } from '@shared/ui/Input/Input';
import styles from './AddEmployeeForm.module.scss';

interface Employee {
  id: number;
  email: string;
  fullName: string;
  role: string;
  institute: string;
}

interface AddEmployeeFormProps {
  onSubmit: (employee: Omit<Employee, 'id'>) => void;
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

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    onSubmit(formData);
    setFormData({
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
    <div className={styles.addEmployeeForm}>
      <h2>Добавить сотрудника</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContent}>
          <Input
            title="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <Input
            title="ФИО"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />

          <div className={styles.formGroup}>
            <label htmlFor="role">Роль:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
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
              value={formData.institute}
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
              value={formData.password}
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
              value={formData.confirmPassword}
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
  );
}; 