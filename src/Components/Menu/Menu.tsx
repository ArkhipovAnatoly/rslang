import { useEffect, useState } from 'react';
import './Menu.css';
import { NavLink, Link, useParams } from 'react-router-dom';

const Menu = ({ menuActive, setMenuActive }: { menuActive: boolean; setMenuActive: (value: boolean) => void }) => {
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
        <div
            className={menuActive ? 'burger-menu_menu active' : 'burger-menu_menu'}
            role="presentation"
            onClick={() => setMenuActive(false)}
        >
            <ul className="burger-menu_items">
                <li className="active">
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
                            <NavLink to={group && page ? `/sprint/${group}/${page}` : '/sprint'}>Спринт</NavLink>
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
        </div>
    );
};
export default Menu;
