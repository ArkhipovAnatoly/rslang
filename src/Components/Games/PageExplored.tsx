import { useState } from "react";
import Footer from "../Home/Footer";
import Header from "../Home/Header";
import Menu from "../Menu/Menu";
import './PageExplored.css'

const PageExplored = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);

  return(
    <div className="explored">
      <Header menuActive={menuActive} setMenuActive={setMenuActive} />
      <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
      <div className="page-message">
      <div className="text-explored">
        <span className="letter">ТРЕНИРОВКИ НЕ НУЖНЫ.</span>
        <span className="letter">НА ЭТОЙ СТРАНИЦЕ</span>
        <span className="letter">ВСЕ ИЗУЧЕНО!</span>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PageExplored;