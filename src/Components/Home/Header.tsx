import './Home.css';
import { Link, useParams } from 'react-router-dom';

const Header = () => {
    const { group, page } = useParams();
    return (
        <div className="wrapper row1">
            <div id="header" className="clear">
                <div id="logo" className="fl_left">
                    <h1>
                        <Link to="/">RSLang</Link>
                    </h1>
                </div>
                <nav id="mainav" className="fl_right">
                    <ul className="clear">
                        <li className="active">
                            <Link to="/">Главная</Link>
                        </li>

                        <li>
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
                            <Link to="/statistics">Статистика</Link>
                        </li>
                        <li>
                            <Link to="/authorization">Войти</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
