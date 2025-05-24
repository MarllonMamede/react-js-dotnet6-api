import React, { useState } from "react";
import './styles.css';
import logoImagem from '../../assets/logo.svg';
import padlock from '../../assets/padlock.png';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {

        const [userName, setUserName] = useState('');
        const [password, setPassword] = useState('');

        const navigate = useNavigate();

        async function login(e) {
                e.preventDefault();
                const data = {
                        userName,
                        password,
                };

                try {
                        const response = await api.post('api/auth/v1/signin', data);
                        console.log('Login response:', response.data);

                        localStorage.setItem('userName', userName);
                        localStorage.setItem('accessToken', response.data.accessToken);
                        localStorage.setItem('refreshToken', response.data.refreshToken);

                        navigate('/books');
                } catch (error) {
                        alert('Usuario ou senha invalido!')
                }
        }

        return (
                <div className="login-container">
                        <section className="form">
                                <img src={logoImagem} alt="Erudio Logo" />
                                <form onSubmit={login}>
                                        <h1>Acesse sua conta</h1>
                                        <input placeholder="Usuario"
                                                value={userName}
                                                onChange={e => setUserName(e.target.value)}
                                        />
                                        <input type="password"
                                                placeholder="Senha"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                        />
                                        <button className="button" type="submit">
                                                Conecte-se
                                        </button>
                                </form>
                        </section>
                        <img className="login-image" src={padlock} alt="Login" />
                </div>
        )
}