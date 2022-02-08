import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Registration.css';
import { useGlobalContext } from '../../GlobalContext';
import Service, { DataUserCreateResponse } from '../../Service';

const Registration = () => {
    const navigate = useNavigate();
    const { setUserId } = useGlobalContext();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(true);
    const [registrationStatusMessage, setRegistrationStatusMessage] = useState<string>('');
    const [loader, setLoader] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const refEmail = useRef<HTMLInputElement>(null);
    const refPassword = useRef<HTMLInputElement>(null);

    const closeFormHandler = (event: React.MouseEvent) => {
        if ((event.target as HTMLDivElement).classList.contains('wrapper-form')) {
            navigate('/');
        }
    };
    const inputHandler = (event: React.ChangeEvent): void => {
        const { id, value } = event.target as HTMLInputElement;

        let isEmailValid = false;
        let isPasswordValid = false;
        switch (id) {
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }

        if (refEmail.current !== null) {
            isEmailValid = (refEmail.current as HTMLInputElement).validity.valid;
        }
        if (refPassword.current !== null) {
            isPasswordValid = (refPassword.current as HTMLInputElement).validity.valid;
        }

        if (name.trim() !== '' && isEmailValid && isPasswordValid) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };
    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setRegistrationStatusMessage('');
        setDisabled(true);
        setLoader(true);
        const response = (await Service.createUser({ name, email, password })) as DataUserCreateResponse;

        setTimeout(() => {
            setLoader(false);
            setDisabled(false);
            if (!response) {
                setSuccess(false);
                setRegistrationStatusMessage(`Пользователь с ${email} уже зарегестрирован!`);
            } else {
                setSuccess(true);
                setRegistrationStatusMessage(`Вы успешно зарегестрировались!`);
                setUserId(response.id);
                // navigate('/');
            }
        }, 3000);
    };

    return (
        <div className="wrapper-form" onClick={closeFormHandler} aria-hidden>
            <section className="content">
                <h1 className="form-title">Регистрация</h1>
                <div className="row">
                    <form onSubmit={submitHandler} noValidate>
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix ">account_circle</i>
                                <input id="name" className="validate" type="text" onChange={inputHandler} required />
                                <label htmlFor="text">Имя</label>
                                <span className="helper-text" data-error="Заполните это поле" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">email</i>
                                <input
                                    ref={refEmail}
                                    id="email"
                                    className="validate"
                                    type="email"
                                    required
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    onChange={inputHandler}
                                />
                                <label htmlFor="email">Email</label>

                                <span className="helper-text" data-error="Email не валиден" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">password</i>
                                <input
                                    ref={refPassword}
                                    id="password"
                                    type="password"
                                    autoComplete="off"
                                    minLength={8}
                                    className="validate"
                                    required
                                    onChange={inputHandler}
                                />
                                <label htmlFor="password">Password</label>
                                <span className="helper-text" data-error="Длина должна быть не менее 8 символов" />
                                <div
                                    style={{ display: loader ? 'inline-block' : 'none' }}
                                    className="preloader-wrapper small active"
                                >
                                    <div className="spinner-layer spinner-blue-only">
                                        <div className="circle-clipper left">
                                            <div className="circle" />
                                        </div>
                                        <div className="gap-patch">
                                            <div className="circle" />
                                        </div>
                                        <div className="circle-clipper right">
                                            <div className="circle" />
                                        </div>
                                    </div>
                                </div>
                                <span style={{ color: success ? 'green' : 'red' }}>
                                    <b>{registrationStatusMessage}</b>
                                </span>
                            </div>
                        </div>

                        <div className="control">
                            <button
                                name="action"
                                className="btn waves-effect waves-light orange darken-1"
                                type="submit"
                                disabled={disabled}
                            >
                                Регистрация
                                <i className="material-icons right">send</i>
                            </button>

                            <Link to="/authorization">Уже есть аккаунт?</Link>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Registration;
