import {useState, useEffect, Dispatch, SetStateAction, ChangeEvent, FormEvent} from 'react';
import './Authorization.scss';
import eyeOpenIcon from '@shared/assets/eye-svgrepo-com.svg';
import eyeClosedIcon from '@shared/assets/eye-closed-svgrepo-com.svg';
import {authApiSlice} from "@features/auth/model/authApiSlice.ts";
import {setAccessToken} from "@features/auth/model/authSlice.ts";
import {useAppDispatch} from "@shared/utils/hooks.ts";
import {Link, useNavigate} from "react-router-dom";

const Authorization = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const [login, loginResponse] = authApiSlice.useLoginMutation();

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email.toLowerCase(),
    );

  //todo: Уведомление об некореектном пароле, состояние загрузки

  const handleInputChange =
    (
      setter: Dispatch<SetStateAction<string>>,
      validator?: (value: string) => void,
    ) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setter(value);
        validator?.(value);
      };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({email, password});
  }

  useEffect(() => {
    const isEmailValid = validateEmail(email);
    setEmailError(isEmailValid || !email ? '' : 'Неправильный формат почты');
  }, [email]);

  useEffect(() => {
    if (loginResponse.isSuccess) {
      dispatch(setAccessToken(loginResponse.data?.accessToken))
      navigate('/');
    }
  }, [loginResponse]);

  const isButtonDisabled = !(email && password && !emailError);

  return (
    <div className="authContainer">
      <form onSubmit={handleSubmit} className="authForm">
        <h1 className="authTitle">Авторизация</h1>
        <input
          type="email"
          placeholder="Почта"
          className="authInput"
          value={email}
          onChange={handleInputChange(setEmail, validateEmail)}
        />
        <div className="passwordContainer">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            className="authInput"
            value={password}
            onChange={handleInputChange(setPassword)}
          />
          <img
            src={showPassword ? eyeOpenIcon : eyeClosedIcon}
            alt={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            className="togglePassword"
            onClick={toggleShowPassword}
          />
        </div>
        <p className={`errorLogin ${emailError ? 'visible' : ''}`}>
          {emailError || ' '}
        </p>
        <div className="buttonWithForgot">
          <Link to="../reset" className="forgotPassword">Забыли пароль?</Link>
          <button
            type="submit"
            className={`loginButton ${isButtonDisabled ? 'disabled' : ''}`}
            disabled={isButtonDisabled}
          >
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default Authorization;
