/* eslint-disable global-require */
import './Games.css';
import Header from '../Home/Header';
import Footer from '../Home/Footer';

const Games = () => (
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
        </ul>
      </div>
    </nav> */}
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
                        <a href="/audioGame/level/1">Начать игру</a>
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
                        <a href="/sprint/level/1">Начать игру</a>
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

export default Games;
