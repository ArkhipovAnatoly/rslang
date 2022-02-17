
import './Home.css';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = ({menuActive, setMenuActive} : {menuActive: boolean, setMenuActive: (value: boolean) => void }) => {
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
                <nav id="mainav" 
                className="fl_right"
                >
                    <ul className="clear">
                        <li className='active'>
                            <Link to="/">Главная</Link>
                        </li>

                        <li >
                            <Link to="/book/1/1">Учебник</Link>
                            <ul>
                                <li>
                                    <Link to="/book/1/1">Раздел1</Link>
                                </li>
                                <li>
                                    <Link to="/book/2/1">Раздел2</Link>
                                </li>
                                <li>
                                    <Link to="/book/3/1">Раздел3</Link>
                                </li>
                                <li>
                                    <Link to="/book/4/1">Раздел4</Link>
                                </li>
                                <li>
                                    <Link to="/book/5/1">Раздел5</Link>
                                </li>
                                <li>
                                    <Link to="/book/6/1">Раздел6</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to={group && page ? `/games/${group}/${page}` : '/games'}>Игры</Link>
                            <ul>
                                <li>
                                    <Link to={group && page ? `/audioGame/${group}/${page}` : '/audioGame'}>
                                        Аудиовызов
                                    </Link>
                                </li>
                                <li>
                                    <Link to={group && page ? `/sprint/${group}/${page}` : '/sprint'}>Спринт</Link>
                                </li>
                            </ul>
                        </li>

                        <li>
                            {isAuth ? (
                                <Link to="/statistics">{localStorage.getItem('name')}</Link>
                            ) : (
                                <Link to="/authorization">Войти</Link>
                            )}
                        </li>

                        <li>
                            {isAuth && (
                                <Link to="/" onClick={() => localStorage.clear()}>
                                    Выйти
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
                <div className="burger-menu" 
            role='presentation'
            onClick={() => setMenuActive(!menuActive)}>
            <span/>
        </div>
                
            </div>
        </div>
    );
};

export default Header;
