import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from '../../Home/Header';
import Footer from '../../Home/Footer';

const Sprint = () => {
    const navigator = useNavigate();
    const [show, setShow] = useState(false);

    const gameLevel = () => {
        if (!show) {
            setShow(!show);
        }
    };

    const handlerGroup = (event: React.MouseEvent) => {
        const { dataset } = event.target as HTMLDivElement;

        if (!dataset.group) {
            return;
        }

        const currentGroup = dataset.group;

        navigator(`/sprint/level/${currentGroup}`);
        gameLevel();
    };

    return (
        <div className="games-page">
            {/* <nav>
        <div id="top" className="nav-wrapper blue">
          <ul id="nav-mobile" className="right">
              <li>
                  <a href="/">Главная</a>
              </li>
              <li>
                  <a href="/book/1/1">Книга</a>
              </li>
              <li>
                  <a href="/games" className="btn-main">Игры</a>
              </li>
            </ul>
          </div>
        </nav> */}
            <Header />
            <div className="card">
                <div className="card-content">
                    <div className="game-content">
                        <h1>Игра Спринт</h1>
                        <h2>Выберите уровень сложности</h2>
                        <div className="groups" aria-hidden onClick={handlerGroup}>
                            <span className="level" data-group="1">
                                A1
                            </span>
                            <span className="level" data-group="2">
                                A2
                            </span>
                            <span className="level" data-group="3">
                                B1
                            </span>
                            <span className="level" data-group="4">
                                B2
                            </span>
                            <span className="level" data-group="5">
                                C1
                            </span>
                            <span className="level" data-group="6">
                                C2
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Sprint;
