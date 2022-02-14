import './Home.css';
import { Link } from 'react-router-dom';

const Header = () => {
    console.log('hi');
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
                            <Link to="/games">Игры</Link>
                            <ul>
                                <li>
                                    <Link to="/audioGame/level/1">Аудиовызов</Link>
                                </li>
                                <li>
                                    <Link to="/sprint/level/1">Спринт</Link>
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
