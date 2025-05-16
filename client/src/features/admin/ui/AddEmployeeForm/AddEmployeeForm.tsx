import React, {useState} from 'react';
import {Button} from '@shared/ui/Button/Button';
import {Input} from '@shared/ui/Input/Input';
import {Select} from '@shared/ui/Select/Select';
import styles from './AddEmployeeForm.module.scss';
import {Employee} from "@features/admin/model/types.ts";

interface AddEmployeeFormProps {
  roles: { name: string, id: number }[];
  institutes: { name: string, id: number }[];
  onSubmit: (employee: Employee) => void;
  initialData?: Employee;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = (props) => {
  const {onSubmit, initialData, roles, institutes} = props

  const [formData, setFormData] = useState({
    id: initialData?.id || 0,
    email: initialData?.email || '',
    fullName: initialData?.fullName || '',
    roleId: initialData?.roleId || 1,
    instituteId: initialData?.instituteId || 1,
  });

  console.log(formData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: keyof Employee, e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [name]: Number(e.target.value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        id: 0,
        email: '',
        fullName: '',
        roleId: 1,
        instituteId: 1,
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
            value={formData.roleId}
            options={roles}
            onChange={(e) => handleSelectChange('roleId', e)}
            required
          />

          <Select
            title="Институт"
            name="institute"
            value={formData.instituteId}
            options={institutes}
            onChange={(e) => handleSelectChange('instituteId', e)}
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
