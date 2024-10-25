import { useState, useEffect } from 'react';
import './Authorization.scss';
import eyeOpenIcon from './assets/eye-svgrepo-com.svg';
import eyeClosedIcon from './assets/eye-closed-svgrepo-com.svg';

const Authorization = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.toLowerCase());

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, validator?: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setter(value);
        validator?.(value);
    };

    useEffect(() => {
        const isEmailValid = validateEmail(email);
        setEmailError(isEmailValid || !email ? '' : 'Неправильный формат почты');
    }, [email]);

    const isButtonDisabled = !(email && password && !emailError);

    return (
        <div className="authContainer">
            <div className="authForm">
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
                <p className={`errorLogin ${emailError ? 'visible' : ''}`}>{emailError || ' '}</p>
                <div className="buttonWithForgot">
                    <p className="forgotPassword">Забыли пароль?</p>
                    <button className={`loginButton ${isButtonDisabled ? 'disabled' : ''}`} disabled={isButtonDisabled}>Войти</button>
                </div>
            </div>
        </div>
    );
};

export default Authorization;