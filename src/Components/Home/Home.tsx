import { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Menu from '../Menu/Menu';

const Home = () => {
    const [menuActive, setMenuActive] = useState<boolean>(false);
    return (
        <div className="home">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
            <div className="wrapper row2 bgded">
                <div className="overlay">
                    <h2>Преимущества</h2>
                    <div id="intro" className="clear">
                        <article className="one_third first">
                            <h3 className="heading">Словарь</h3>
                            <ul className="nospace">
                                <li>Граммотная сортировка слов: </li>
                                <li>-по уровню сложности</li>
                                <li>-по изученности</li>
                                <li>Транскрипция</li>
                                <li>Аудиосопровождение</li>
                            </ul>
                            <p className="link">
                                <Link to="/">Read More &raquo;</Link>
                            </p>
                        </article>
                        <article className="one_third">
                            <h3 className="heading">Статистика</h3>
                            <ul className="nospace">
                                <li>Простматривай свой прогресс изучения:</li>
                                <li>-количество новых слов за день</li>
                                <li>-количество изученных слов за день</li>
                                <li>-процент правильных ответов за день</li>
                            </ul>
                            <p className="link">
                                <Link to="/">Read More &raquo;</Link>
                            </p>
                        </article>
                        <article className="one_third">
                            <h3 className="heading">Игры </h3>
                            <ul className="nospace">
                                <li>Сделайте изучение слов более увлекательным:</li>
                                <li>- уровни сложности</li>
                                <li>- улучшение запоминания</li>
                                <li>- восприятие на слух и навыки перевода</li>
                            </ul>
                            <p className="link">
                                <Link to="/">Read More &raquo;</Link>
                            </p>
                        </article>
                    </div>
                </div>
            </div>
            <div className="wrapper row3">
                <main className="container clear">
                    <div className="home_group">
                        <div className="one_half first">
                            <h2 className="heading btmspace-50">Презентация</h2>
                            <figure id="featuredpost">
                                <figcaption>
                                    <h2 className="heading">Urna sit amet pulvinar</h2>
                                    <p className="shortintro">
                                        Aenean semper elementum tellus, ut placerat leo. Quisque vehicula, urna sit
                                        amet.&hellip;
                                    </p>
                                    <p className="link">
                                        <Link className="btn" to="/">
                                            Read More &raquo;
                                        </Link>
                                    </p>
                                </figcaption>
                            </figure>
                        </div>
                        <div className="one_half">
                            <h2 className="heading btmspace-50">О команде</h2>
                            <ul id="latestposts" className="nospace">
                                <li className="clear">
                                    <figure className="one_quarter first row3_1" />
                                    <article className="three_quarter">
                                        <h2 className="heading">Разработчик 1</h2>
                                        <p className="shortintro">Разработчик высший класс!&hellip;</p>
                                        <p className="link">
                                            <a className="btn" href="/">
                                                Read More &raquo;
                                            </a>
                                        </p>
                                    </article>
                                </li>
                                <li className="clear">
                                    <figure className="one_quarter first row3_2" />
                                    <article className="three_quarter">
                                        <h2 className="heading">Разработчик 2</h2>
                                        <p className="shortintro">Разработчик высший класс!&hellip;</p>
                                        <p className="link">
                                            <a className="btn" href="/">
                                                Read More &raquo;
                                            </a>
                                        </p>
                                    </article>
                                </li>
                                <li className="clear">
                                    <figure className="one_quarter first row3_3" />
                                    <article className="three_quarter">
                                        <h2 className="heading">Разработчик 3</h2>
                                        <p className="shortintro">Разработчик высший класс!&hellip;</p>
                                        <p className="link">
                                            <a className="btn" href="/">
                                                Read More &raquo;
                                            </a>
                                        </p>
                                    </article>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="clear" />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
