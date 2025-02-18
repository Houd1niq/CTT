import React, {FormEvent, useEffect, useState} from 'react';
import './Reset.scss';
import {Input} from "../../components/ui/Input/Input.tsx";
import {authApiSlice} from "../../services/CTTApi/authApiSlice.ts";
import {useNotification} from "../../components/Notification/hooks/notification-hooks.ts";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../store/hooks.ts";
import {setRecoveryEmail} from "../../store/slices/authSlice.ts";

const Reset: React.FC = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [sendEmail, sendEmailResponse] = authApiSlice.useSendCodeMutation()
  const {setNotification} = useNotification()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendEmail(email)
  }

  useEffect(() => {
    if (sendEmailResponse.isSuccess) {
      dispatch(setRecoveryEmail(email))
      navigate('../confirm')
    }
    if (sendEmailResponse.isError) {
      setNotification({
        type: "error",
        message: JSON.stringify('Что-то пошло не так, скорее всего пользователь с таким email не найден')
      })
    }
  }, [sendEmailResponse]);

  return (
    <div className="forgotContainer">
      <form onSubmit={handleSubmit} className="forgotForm">
        <h1 className="forgotTitle">Восстановление пароля</h1>
        <div className="forgotContent">
          <Input
            title="Введите email"
            type="email"
            value={email}
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <button
          className={`confirmButton`}
          type="submit"
        >
          Подтвердить
        </button>
      </form>
    </div>
  );
};

export default Reset;
