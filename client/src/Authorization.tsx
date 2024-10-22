import { useState, useEffect } from 'react';
import './Authorization.scss';

const Authorization = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.toLowerCase());

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, validator?: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setter(value);
        if (validator) validator(value);
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
                <input type="email" placeholder="Почта" className="authInput" value={email} onChange={handleInputChange(setEmail, validateEmail)} />
                <input type="password" placeholder="Пароль" className="authInput" value={password} onChange={handleInputChange(setPassword)} />
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