import React, { useState, useEffect } from 'react';
import './EmailConfirm.scss';

const EmailConfirm: React.FC = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [resendCountdown, setResendCountdown] = useState<number | null>(null);

  useEffect(() => {
    setIsButtonDisabled(code.some((digit) => digit === ''));
  }, [code]);

  useEffect(() => {
    if (resendCountdown !== null && resendCountdown > 0) {
      const timer = setInterval(
        () => setResendCountdown((prev) => prev! - 1),
        1000,
      );
      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

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

  const handleResendClick = () => {
    setResendCountdown(60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="emailContainer">
      <div className="emailContainerForm">
        <div className="information">
          <h1 className="emailTitle">Подтверждение эл. почты</h1>
          <p className="emailLabel">
            Введите код из письма, который мы отправили на почту
            XXXXXXXXXXXXXXXXXXXXXXXXX
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
        >
          Подтвердить
        </button>
        {resendCountdown !== null && resendCountdown > 0 ? (
          <p className="sendCodeAgain">
            Повторно отправить код можно через {formatTime(resendCountdown)}
          </p>
        ) : (
          <button className="sendCodeAgainButton" onClick={handleResendClick}>
            Отправить повторно
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailConfirm;
