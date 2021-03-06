import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Service, { DataUserLoginResponse } from '../../../Service';
import PreLoaderCircle from '../../Preloader/PreLoaderCircle';

const Authorization = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(true);
    const refEmail = useRef(null);
    const refPassword = useRef(null);
    const navigate = useNavigate();
    const [loginStatusMessage, setLoginStatusMessage] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);

    const closeFormHandler = (event: React.MouseEvent) => {
        if ((event.target as HTMLDivElement).classList.contains('wrapper-form')) navigate('/');
    };
    const inputHandler = (event: React.ChangeEvent): void => {
        const { id, value } = event.target as HTMLInputElement;
        let isEmailValid = false;
        let isPasswordValid = false;
        switch (id) {
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

        if (isEmailValid && isPasswordValid) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };
    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoginStatusMessage('');
        setDisabled(true);
        setLoader(true);
        const responseLogin = (await Service.loginUser({ email, password })) as DataUserLoginResponse;
        setLoader(false);
        setDisabled(false);
        if (!responseLogin) {
            setSuccess(false);
            setLoginStatusMessage(`???????????????? Email ?????? ????????????!`);
        } else {
            setSuccess(true);
            setLoginStatusMessage(`???? ?????????????? ????????????????????????????!`);
            localStorage.setItem('name', responseLogin.name);
            localStorage.setItem('userId', responseLogin.userId);
            localStorage.setItem('token', responseLogin.token);
            localStorage.setItem('refreshToken', responseLogin.refreshToken);

            setTimeout(() => {
                navigate('/');
            }, 1500);
        }
    };
    return (
        <div className="wrapper-form" aria-hidden onClick={closeFormHandler}>
            <section id="content" className="content">
                <h1>??????????</h1>
                <div className="row">
                    <form className="col s12" noValidate onSubmit={submitHandler}>
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">email</i>
                                <input
                                    ref={refEmail}
                                    id="email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    className="validate"
                                    type="email"
                                    required
                                    onChange={inputHandler}
                                />
                                <label htmlFor="email">Email</label>
                                <span className="helper-text" data-error="Email ???? ??????????????" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">password</i>
                                <input
                                    ref={refPassword}
                                    id="password"
                                    className="validate"
                                    type="password"
                                    autoComplete="off"
                                    minLength={8}
                                    required
                                    onChange={inputHandler}
                                />
                                <label htmlFor="password">Password</label>
                                <span className="helper-text" data-error="?????????? ???????????? ???????? ???? ?????????? 8 ????????????????" />
                                <PreLoaderCircle show={loader} />
                                <span style={{ color: success ? 'green' : 'red' }}>
                                    <b>{loginStatusMessage}</b>
                                </span>
                            </div>
                        </div>
                        <div className="control">
                            <button
                                disabled={disabled}
                                className="btn waves-effect waves-light blue darken-1"
                                type="submit"
                                name="action"
                            >
                                ??????????
                                <i className="material-icons right">send</i>
                            </button>
                            <Link to="/registration">??????????????????????</Link>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Authorization;
