/* eslint-disable global-require */
import { Link, useParams } from 'react-router-dom';
import './Games.css';
import Header from '../Home/Header';
import Footer from '../Home/Footer';

const Games = () => {
    const { group, page } = useParams();
    return (
        <div className="games-page">
            <Header />
            <div className="cards">
                <div className="card">
                    <div className="card-image waves-effect waves-block waves-light">
                        <img className="image" src={require('./images/2.png')} alt="audio game" />
                    </div>
                    <div className="card-content">
                        <span className="card-title activator grey-text text-darken-4">
                            Аудиовызов<i className="material-icons right">more_vert</i>
                        </span>
                        <p>
                            <Link
                                to={group && page ? `/audioGame/${group}/${page}` : '/audioGame'}
                                className="open-game"
                            >
                                <span data-hover="Начать игру">Начать игру</span>
                            </Link>
                        </p>
                    </div>
                    <div className="card-reveal">
                        <span className="card-title grey-text text-darken-4">
                            Аудиовызов<i className="material-icons right">close</i>
                        </span>
                        <p>Тренировка Аудиовызов улучшает твое восприятие речи на слух.</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-image waves-effect waves-block waves-light">
                        <img className="image" src={require('./images/1.png')} alt="sprint" />
                    </div>
                    <div className="card-content">
                        <span className="card-title activator grey-text text-darken-4">
                            Спринт<i className="material-icons right">more_vert</i>
                        </span>
                        <p>
                            <Link to={group && page ? `/sprint/${group}/${page}` : '/sprint'} className="open-game">
                                <span data-hover="Начать игру">Начать игру</span>
                            </Link>
                        </p>
                    </div>
                    <div className="card-reveal">
                        <span className="card-title grey-text text-darken-4">
                            Спринт<i className="material-icons right">close</i>
                        </span>
                        <p>Спринт - тренировка на скорость. Попробуй угадать как можно больше слов за 30 секунд.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Games;
