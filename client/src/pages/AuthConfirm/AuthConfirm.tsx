import React, {useState, useEffect} from 'react';
import './auth-confirm.scss';
import {useAppDispatch, useAppSelector} from "@shared/utils/hooks.ts";
import {authApiSlice} from "@features/auth/model/authApiSlice.ts";
import {useNavigate} from "react-router-dom";
import {setAccessToken} from "@features/auth/model/authSlice.ts";
import {useNotification} from "@shared/model/notification/notification-hooks.ts";

const AuthConfirm: React.FC = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {setNotification} = useNotification()
  const email = useAppSelector(state => state.authReducer.recoveryEmail)

  const [confirmTrigger, confirmResponse] = authApiSlice.useConfirmAuthMutation()

  useEffect(() => {
    setIsButtonDisabled(code.some((digit) => digit === ''));
  }, [code]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        document.getElementById(`emailForm-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        document.getElementById(`emailForm-${index - 1}`)?.focus();
      }
    }
  };

  const handleSubmit = () => {
    if (!email) return
    confirmTrigger({email, code: code.join('')})
    // dispatch(setRecoveryToken(code.join('')))
  }

  useEffect(() => {
    if (confirmResponse.isSuccess) {
      console.log(confirmResponse)
      dispatch(setAccessToken(confirmResponse.data?.accessToken))
      navigate('/')
    }
    if (confirmResponse.isError) {
      setNotification({message: 'Код веедён неверно или его время действия истекло', type: 'error'})
    }
  }, [confirmResponse]);

  if (!email) {
    navigate('/auth')
  }

  return (
    <div className="emailContainer">
      <div className="emailContainerForm">
        <div className="information">
          <h1 className="emailTitle">Подтверждение входа</h1>
          <p className="emailLabel">
            Введите код из письма, который мы отправили на указанную электронную почту
          </p>
        </div>
        <div className="emailForm">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`emailForm-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="emailCell"
            />
          ))}
        </div>
        <button
          className={`confirmButtonEmail ${isButtonDisabled ? 'disabled' : ''}`}
          disabled={isButtonDisabled}
          onClick={handleSubmit}
        >
          Подтвердить
        </button>
      </div>
    </div>
  );
};

export default AuthConfirm;
