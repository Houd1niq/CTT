import React, {useState} from 'react';
import {Button} from '@shared/ui/Button/Button';
import {Input} from '@shared/ui/Input/Input';
import {Select} from '@shared/ui/Select/Select';
import styles from './AddEmployeeForm.module.scss';

interface Employee {
  id: number;
  email: string;
  fullName: string;
  role: string;
  institute: string;
}

interface AddEmployeeFormProps {
  onSubmit: (employee: Employee) => void;
  initialData?: Employee;
}

const institutes = [
  {id: 'Институт машиностроения', name: 'Институт машиностроения'},
  {id: 'Институт менеджмента', name: 'Институт менеджмента'},
  {id: 'Институт информационных технологий', name: 'Институт информационных технологий'},
  {id: 'Институт экономики и управления', name: 'Институт экономики и управления'},
  {id: 'Институт гуманитарных наук', name: 'Институт гуманитарных наук'},
  {id: 'Институт строительства и архитектуры', name: 'Институт строительства и архитектуры'},
  {id: 'Институт химии и химической технологии', name: 'Институт химии и химической технологии'},
  {id: 'Институт энергетики и автоматизации', name: 'Институт энергетики и автоматизации'},
];

const roles = [
  {id: 'admin', name: 'Администратор'},
  {id: 'manager', name: 'Менеджер'},
  {id: 'user', name: 'Пользователь'},
];

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({onSubmit, initialData}) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || 0,
    email: initialData?.email || '',
    fullName: initialData?.fullName || '',
    role: initialData?.role || '',
    institute: initialData?.institute || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleSelectChange = (name: string, value: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        id: 0,
        email: '',
        fullName: '',
        role: '',
        institute: '',
      });
    }
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

          <Select
            title="Роль"
            name="role"
            value={formData.role}
            options={roles}
            // onChange={(value) => handleSelectChange('role', value as string)}
            required
          />

          <Select
            title="Институт"
            name="institute"
            value={formData.institute}
            options={institutes}
            // onChange={(value) => handleSelectChange('institute', value as string)}
            required
          />

          {/*{!initialData && (*/}
          {/*  <>*/}
          {/*    <div className={styles.passwordGroup}>*/}
          {/*      <Input*/}
          {/*        title="Пароль"*/}
          {/*        type={showPassword ? "text" : "password"}*/}
          {/*        name="password"*/}
          {/*        value={formData.password}*/}
          {/*        onChange={handleInputChange}*/}
          {/*        required*/}
          {/*      />*/}
          {/*      <button*/}
          {/*        type="button"*/}
          {/*        className={styles.passwordToggle}*/}
          {/*        onClick={togglePasswordVisibility}*/}
          {/*      >*/}
          {/*        {showPassword ? "👁️" : "👁️‍🗨️"}*/}
          {/*      </button>*/}
          {/*    </div>*/}

          {/*    /!*<div className={styles.passwordGroup}>*!/*/}
          {/*    /!*  <Input*!/*/}
          {/*    /!*    title="Подтверждение пароля"*!/*/}
          {/*    /!*    type={showConfirmPassword ? "text" : "password"}*!/*/}
          {/*    /!*    name="confirmPassword"*!/*/}
          {/*    /!*    value={formData.confirmPassword}*!/*/}
          {/*    /!*    onChange={handleInputChange}*!/*/}
          {/*    /!*    required*!/*/}
          {/*    /!*  />*!/*/}
          {/*    /!*  <button*!/*/}
          {/*    /!*    type="button"*!/*/}
          {/*    /!*    className={styles.passwordToggle}*!/*/}
          {/*    /!*    onClick={toggleConfirmPasswordVisibility}*!/*/}
          {/*    /!*  >*!/*/}
          {/*    /!*    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}*!/*/}
          {/*    /!*  </button>*!/*/}
          {/*    /!*</div>*!/*/}
          {/*  </>*/}
          {/*)}*/}
        </div>

        <Button type="submit" className={styles.submitButton}>
          {initialData ? 'Сохранить изменения' : 'Добавить сотрудника'}
        </Button>
      </form>
    </div>
  );
};
