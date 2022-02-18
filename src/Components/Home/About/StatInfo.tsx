import { useState } from 'react';
import './about.css';
import Header from '../Header';
import Footer from '../Footer';
import Menu from '../../Menu/Menu';

const StatInfo = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
      return(
      
      <div className="info_wrapper">
          <Header menuActive={menuActive} setMenuActive={setMenuActive} />
          <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
          StatkInfo
          <Footer />
      </div>
  )};

export default StatInfo;