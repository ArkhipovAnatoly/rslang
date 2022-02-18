import './Menu.css';
import { NavLink, useParams } from 'react-router-dom';

const Menu = ({ menuActive, setMenuActive }: { menuActive: boolean; setMenuActive: (value: boolean) => void }) => {
    const { group, page } = useParams();
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
                    <NavLink to="/statistics">Статистика</NavLink>
                </li>
                <li>
                    <NavLink to="/authorization">Войти</NavLink>
                </li>
            </ul>
        </div>
    );
};
export default Menu;
