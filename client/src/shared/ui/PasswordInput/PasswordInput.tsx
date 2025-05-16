import cn from 'classnames';
import cls from './password-input.module.scss';
import eyeOpenIcon from "@shared/assets/eye-svgrepo-com.svg";
import eyeClosedIcon from "@shared/assets/eye-closed-svgrepo-com.svg";
import {ChangeEvent, useState} from "react";

type PasswordInputProps = {
  placeholder?: string
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const PasswordInput = (props: PasswordInputProps) => {
  const {
    className,
    onChange,
    placeholder
  } = props;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    onChange?.(e)
  }

  return (
    <div className={cn(cls.passwordInput, className)}>
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        className={cls.input}
        value={password}
        onChange={handleInputChange}
      />
      <img
        src={showPassword ? eyeOpenIcon : eyeClosedIcon}
        alt={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        className={cls.eyeIcon}
        onClick={toggleShowPassword}
      />
    </div>
  );
};
