import cn from 'classnames';
import cls from './button.module.scss';
import {ButtonHTMLAttributes, ReactNode} from "react";

type ButtonProps = {
  className?: string;
  onClick?: (...args: any[]) => any;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  const {
    className,
    onClick,
    children,
    ...other
  } = props;

  return (
    <button
      onClick={onClick}
      className={cn(cls.button, className)}
      {...other}
    >
      {children}
    </button>
  );
};
