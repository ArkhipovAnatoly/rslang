import  './Home.css';
import { Link } from 'react-router-dom';


const Home = () => {
  console.log('hi')
  return (
<div className='home'>
      
<div className="wrapper row1">
  <header id="header" className="clear"> 
    <div id="logo" className="fl_left">
      <h1><a href="index.html">RSLang</a></h1>
    </div>
    <nav id="mainav" className="fl_right">
      <ul className="clear">
        <li className="active"><a href="/">Главная</a></li>
        
        <li ><a href="/">Учебник</a>
        <ul>
            <li><a href="/">Раздел1</a></li>
            <li><a href="/">Раздел2</a></li>
            <li><a href="/">Раздел3</a></li>
            <li><a href="/">Раздел4</a></li>
            <li><a href="/">Раздел5</a></li>
            <li><a href="/">Раздел6</a></li>
          </ul>
        </li>
        <li ><a href="/">Игры</a>
          <ul>
            <li><a href="/">Аудиовызов</a></li>
            <li><a href="/">Спринт</a></li>
          </ul>
          </li>
        <li><a href="/">Статистика</a></li>
        <li><a href="/">Войти</a></li>
      </ul>
    </nav>
  </header>
</div>
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
        <p className="link"><Link to="/">Read More &raquo;</Link></p>
      </article>
      <article className="one_third">
        <h3 className="heading">Статистика</h3>
        <ul className="nospace">
          <li>Простматривай свой прогресс изучения:</li>
          <li>-количество новых слов за день</li>
          <li>-количество изученных слов за день</li>
          <li>-процент правильных ответов за день</li>
        </ul>
        <p className="link"><a href="/">Read More &raquo;</a></p>
      </article>
      <article className="one_third">
        <h3 className="heading">Игры </h3>
        <ul className="nospace">
          <li>Сделайте изучение слов более увлекательным:</li>
          <li>- уровни сложности</li>
          <li>- улучшение запоминания</li>
          <li>- восприятие на слух и навыки перевода</li>
        </ul>
        <p className="link"><a href="/">Read More &raquo;</a></p>
      </article>
    </div>
  </div>
</div>
<div className="wrapper row3">
  <main className="container clear">
    <div className="group">
      <div className="one_half first">
        <h2 className="heading btmspace-50">Презентация</h2>
        <figure id="featuredpost">
          <figcaption>
            <h2 className="heading">Urna sit amet pulvinar</h2>
            <p className="shortintro">Aenean semper elementum tellus, ut placerat leo. Quisque vehicula, urna sit amet.&hellip;</p>
            <p className="link"><a className="btn" href="/">Read More &raquo;</a></p>
          </figcaption>
        </figure>
      </div>
      <div className="one_half">
        <h2 className="heading btmspace-50">О команде</h2>
        <ul id="latestposts" className="nospace">
          <li className="clear">
            <figure className="one_quarter first row3_1"/>
            <article className="three_quarter">
              <h2 className="heading">Разработчик 1</h2>
              <p className="shortintro">Разработчик высший класс!&hellip;</p>
              <p className="link"><a className="btn" href="/">Read More &raquo;</a></p>
            </article>
          </li>
          <li className="clear">
            <figure className="one_quarter first row3_2"/>
            <article className="three_quarter">
              <h2 className="heading">Разработчик 2</h2>
              <p className="shortintro">Разработчик высший класс!&hellip;</p>
              <p className="link"><a className="btn" href="/">Read More &raquo;</a></p>
            </article>
          </li>
          <li className="clear">
            <figure className="one_quarter first row3_3"/>
              <article className="three_quarter">
              <h2 className="heading">Разработчик 3</h2>
              <p className="shortintro">Разработчик высший класс!&hellip;</p>
              <p className="link"><a className="btn" href="/">Read More &raquo;</a></p>
            </article>
          </li>
        </ul>
      </div>
    </div>
    <div className="clear" />
  </main>
</div>
<div className="wrapper row6">
  <div id="copyright" className="clear"> 
    <a className="rss" href="https://rs.school/js/"  rel="noopener"> <span className="rss-year">`22</span> </a>
    <div className='githab'>
      <a href='/'>Разработчик 1</a>
      <a href='/'>Разработчик 2</a>
      <a href='/'>Разработчик 3</a>
    </div>

  </div>
</div>
    </div>
  );
};

export default Home;