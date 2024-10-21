import { useState, useEffect } from 'react';
import './Authorization.scss';

const Authorization = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (value && !validateEmail(value)) {
            setEmailError('Неправильный формат почты');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    useEffect(() => {
        if (email && password && !emailError) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [email, password, emailError]);

    return (
        <div className="authContainer">
            <div className="authForm">
                <h1 className="authTitle">Авторизация</h1>
                <input type="email" placeholder="Почта" className="authInput" value={email} onChange={handleEmailChange}/>
                <input type="password" placeholder="Пароль" className="authInput" value={password} onChange={handlePasswordChange}/>
                {<p className={`errorLogin ${emailError ? 'visible' : ''}`}>{emailError || ' '}</p>}
                <div className="buttonWithForgot">
                    <p className="forgotPassword">Забыли пароль?</p>
                    <button className="loginButton" disabled={isButtonDisabled} style={{ backgroundColor: isButtonDisabled ? 'grey' : 'rgb(15, 74, 138)' }}>Войти</button>
                </div>
            </div>
        </div>
    );
};

export default Authorization;