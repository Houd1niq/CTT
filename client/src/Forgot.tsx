import React, { useState } from 'react';
import './Forgot.scss';
import eyeOpenIcon from './assets/eye-svgrepo-com.svg';
import eyeClosedIcon from './assets/eye-closed-svgrepo-com.svg';

const Forgot: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const isPasswordMatch = password === confirmPassword && password.length > 0;

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
                    <p className={`errorMessage ${isPasswordMatch ? 'hidden' : ''}`}>
                        Пароли не совпадают
                    </p>
                </div>
                <button className={`confirmButton ${!isPasswordMatch ? 'disabled' : ''}`} disabled={!isPasswordMatch}>
                    Подтвердить
                </button>
            </div>
        </div>
    );
};

export default Forgot;