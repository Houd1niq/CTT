import React, {useEffect, useState} from 'react';
import './Forgot.scss';
import eyeOpenIcon from '../../assets/eye-svgrepo-com.svg';
import eyeClosedIcon from '../../assets/eye-closed-svgrepo-com.svg';
import {authApiSlice} from "../../services/CTTApi/authApiSlice.ts";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../../components/Notification/hooks/notification-hooks.ts";
import {setRecoveryEmail, setRecoveryToken} from "../../store/slices/authSlice.ts";

const Forgot: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const {setNotification} = useNotification()

  const [changePasswordTrigger, changePasswordResponse] = authApiSlice.useChangePasswordMutation()

  const code = useAppSelector(state => state.authReducer.recoveryToken)
  const email = useAppSelector(state => state.authReducer.recoveryEmail)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = () => {
    if (!code || !email) return;
    changePasswordTrigger({
      code, email, password, confirmPassword
    })
  }

  useEffect(() => {
    if (changePasswordResponse.isSuccess) {
      setNotification({
        message: "Пароль был успешно изменён",
        type: 'success'
      })
      navigate("../auth")
      dispatch(setRecoveryToken(null))
      dispatch(setRecoveryEmail(null))
    }
    if (changePasswordResponse.isError) {
      setNotification({
        message: "Что-то пошло не так, возможно код смены пароля истёк",
        type: 'error'
      })
    }
  }, [changePasswordResponse]);

  useEffect(() => {
    if (!code || !email) {
      navigate('../auth')
    }
  }, [code, email]);

  const isPasswordMatch = password === confirmPassword && password.length > 0;
  const showError =
    (password.length > 0 || confirmPassword.length > 0) && !isPasswordMatch;

  return (
    <div className="forgotContainer">
      <div className="forgotForm">
        <h1 className="forgotTitle">Смена пароля</h1>
        <div className="forgotContent">
          <p className="forgotLabel">Введите новый пароль</p>
          <div className="inputWrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="forgotInput"
              value={password}
              onChange={handlePasswordChange}
            />
            <img
              src={showPassword ? eyeOpenIcon : eyeClosedIcon}
              alt="Toggle password visibility"
              className="togglePassword"
              onClick={toggleShowPassword}
            />
          </div>
          <p className="forgotLabel">Повторите пароль</p>
          <div className="inputWrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="forgotInput"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <img
              src={showPassword ? eyeOpenIcon : eyeClosedIcon}
              alt="Toggle password visibility"
              className="togglePassword"
              onClick={toggleShowPassword}
            />
          </div>
          <p className={`errorMessage ${showError ? '' : 'hidden'}`}>
            Пароли не совпадают
          </p>
        </div>
        <button
          className={`confirmButton ${!isPasswordMatch ? 'disabled' : ''}`}
          disabled={!isPasswordMatch}
          onClick={handleSubmit}
        >
          Подтвердить
        </button>
      </div>
    </div>
  );
};

export default Forgot;
