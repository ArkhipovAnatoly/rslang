import { useState } from 'react';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import './Statistics.css';
import Menu from '../Menu/Menu';

const Statistics = () => {
    const [menuActive, setMenuActive] = useState<boolean>(false);
    return (
        <div className="statistics_wrapper">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive}/>
            <Footer />
        </div>
    );
};
export default Statistics;
