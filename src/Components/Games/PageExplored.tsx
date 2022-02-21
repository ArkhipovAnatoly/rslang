import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../Home/Footer";
import Header from "../Home/Header";
import Menu from "../Menu/Menu";
import './PageExplored.css'

type DataParams = {
  group: string;
  page: string;
};

const PageExplored = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const { group, page } = useParams<DataParams>();
  
  return(
    <div className="explored">
      <Header menuActive={menuActive} setMenuActive={setMenuActive} />
      <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
      <div className="page-message">
        <div className="text-explored">
          <span className="letter">ТРЕНИРОВКИ НЕ НУЖНЫ.</span>
          <span className="letter">НА ЭТОЙ СТРАНИЦЕ</span>
          <span className="letter">ВСЕ ИЗУЧЕНО!</span>
          <p>
            <Link to={`/book/${group}/${page}`} className="return-book">
                <span data-hover="Вернуться на главную страницу">Вернуться на главную страницу</span>
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PageExplored;