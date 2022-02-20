import './Home.css';
import { Link, NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = ({ menuActive, setMenuActive }: { menuActive: boolean; setMenuActive: (value: boolean) => void }) => {
    const { group, page } = useParams();
    const [isAuth, setIsAuth] = useState<Boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        if (token !== null && userId !== null) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);
    return (
        <div className="wrapper row1">
            <div id="header" className="clear">
                <div id="logo" className="fl_left">
                    <h1>
                        <Link to="/">RSLang</Link>
                    </h1>
                </div>
                <div className="header_greeting">
                    {isAuth ? <p>Приветствуем Вас, {localStorage.getItem('name')}!</p> : <p>Приветствуем Вас!</p>}
                </div>
                <nav id="mainav" className="fl_right">
                    <ul className="clear">
                        <li>
                            <NavLink to="/">Главная</NavLink>
                        </li>

                        <li>
                            <NavLink to="/book/1/1">Учебник</NavLink>
                            <ul>
                                <li>
                                    <NavLink to="/book/1/1">Раздел1</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/book/2/1">Раздел2</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/book/3/1">Раздел3</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/book/4/1">Раздел4</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/book/5/1">Раздел5</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/book/6/1">Раздел6</NavLink>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to={group && page ? `/games/${group}/${page}` : '/games'}>Игры</NavLink>
                            <ul>
                                <li>
                                    <NavLink to={group && page ? `/audioGame/${group}/${page}` : '/audioGame'}>
                                        Аудиовызов
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={group && page ? `/sprint/${group}/${page}` : '/sprint'}>
                                        Спринт
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li>
                            {isAuth ? (
                                <NavLink to="/statistics">{localStorage.getItem('name')}</NavLink>
                            ) : (
                                <NavLink to="/authorization">Войти</NavLink>
                            )}
                        </li>

                        <li>
                            {isAuth && (
                                <Link
                                    to="/"
                                    onClick={() => {
                                        localStorage.clear();
                                        setIsAuth(false);
                                    }}
                                >
                                    Выйти
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
                <div className="burger-menu" role="presentation" onClick={() => setMenuActive(!menuActive)}>
                    <span />
                </div>
            </div>
        </div>
    );
};

export default Header;
