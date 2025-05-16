import React, {ChangeEvent} from 'react';
import styles from './Select.module.scss';

interface Option {
  id: number | string;
  name: string;
}

interface SelectProps {
  title: string;
  name: string;
  value: number | string;
  options: Option[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
  required?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = (props) => {
  const {
    title,
    name,
    value,
    options,
    onChange,
    required = false,
    className,
  } = props

  return (
    <div className={`${styles.selectGroup} ${className || ''}`}>
      <label htmlFor={name} className={styles.label}>
        {title}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.select}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
