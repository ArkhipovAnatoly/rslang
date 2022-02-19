import { useState } from 'react';
import { Link } from 'react-router-dom';
import './about.css';
import Header from '../Header';
import Footer from '../Footer';
import Menu from '../../Menu/Menu';

const StatInfo = () => {
    const [menuActive, setMenuActive] = useState<boolean>(false);
    return (
        <div className="info_wrapper">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
            <div className="info-image3" />
            <h2 className="info-title">Статистика</h2>
            <div className="info-description">
                <p>
                    В личном кабинете ты можешь следить за своим прогрессом: сколько слов ты уже выучил всего и за
                    каждый день.
                </p>
                <p>Подробная статистика твоих достижений, изученных слов и ошибок</p>
                <p>Отслеживай свой прогресс в индивидуальной статистике!</p>
                <p>Cтавь цели! </p>
                <p>Вдохновляйся на достижение новых результатов каждый день!</p>
            </div>
            <Link className="arrow-back" to="/" />
            <Footer />
        </div>
    );
};

export default StatInfo;
