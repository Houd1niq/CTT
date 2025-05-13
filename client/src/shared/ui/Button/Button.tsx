import cn from 'classnames';
import cls from './button.module.scss';
import {ReactNode} from "react";

type ButtonProps = {
  className?: string;
  onClick: (...args: any[]) => any;
  children: ReactNode;
}

export const Button = (props: ButtonProps) => {
  const {
    className,
    onClick,
    children
  } = props;

  return (
    <button
      onClick={onClick}
      className={cn(cls.button, className)}
    >
      {children}
    </button>
  );
};
