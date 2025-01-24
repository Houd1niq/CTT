import cn from 'classnames';
import cls from './input.module.scss';
import {DetailedHTMLProps, InputHTMLAttributes} from "react";

type InputProps = {
  title: string
  className?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input = (props: InputProps) => {
  const {
    className,
    name,
    title
  } = props;
  return (
    <div className={cn(className)}>
      <label htmlFor={name} className={cls.label}>
        {title}
      </label>
      <input
        className={cls.input}
        name={name}
        {...props}
      >
      </input>
    </div>
  );
};
