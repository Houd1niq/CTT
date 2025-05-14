import cn from 'classnames';
import cls from './input.module.scss';
import {DetailedHTMLProps, InputHTMLAttributes} from "react";

type InputProps = {
  title: string;
  className?: string;
  inputTitle?: string; // HTML title attribute
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'title'>

export const Input = (props: InputProps) => {
  const {
    className,
    name,
    title,
    inputTitle,
    id = name, // Use name as id if not provided
    type = 'text', // Default type is text
    ...restProps
  } = props;
  
  return (
    <div className={cn(className)}>
      <label htmlFor={id} className={cls.label}>
        {title}
      </label>
      <input
        className={cls.input}
        name={name}
        id={id}
        type={type}
        role={type === 'text' ? 'textbox' : undefined}
        title={inputTitle}
        {...restProps}
      />
    </div>
  );
};
