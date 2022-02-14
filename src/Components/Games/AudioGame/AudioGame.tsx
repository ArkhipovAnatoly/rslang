import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './AudioGame.css';
import { DataWord } from '../../../Service';
import Header from '../../Home/Header';
import Footer from '../../Home/Footer';

const AudioGame = () => {
    const navigator = useNavigate();
    const [words] = useState<DataWord[]>([]);
    const [show, setShow] = useState(false);
    const [showNextQuestion, setShowNextQuestion] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    // const player = new Audio('');

    // const audioUrl = `https://learn-english-words-app.herokuapp.com/${props.audio}`;
    //  const imageUrl = `https://learn-english-words-app.herokuapp.com/${words.audio}`;

    console.log(words);

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

        navigator(`/audioGame/level/${currentGroup}`);
        gameLevel();
    };

    const nextQuestion = () => {
        setShowAnswer(!showAnswer);
        setShowNextQuestion(!showNextQuestion);
    };

    // const handlerAudio = () => {
    //   player.src = audioUrl;
    //   if (player.paused) {
    //       player.play();
    //       return;
    //   }
    //   player.pause();
    // };

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
                    <div className="content">
                        <h1>Игра Аудиовызов</h1>
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
                        <div
                            className="btn-start"
                            aria-hidden
                            onClick={() => {
                                setShow(!show);
                            }}
                        >
                            Начать игру
                        </div>
                        {show && (
                            <div className="game-container">
                                <div className="audio-question">
                                    {showAnswer && <div className="right-image">image</div>}
                                    <i
                                        aria-hidden
                                        // onClick={handlerAudio}
                                        style={{ cursor: 'pointer', color: 'red' }}
                                        className={`material-icon prefix `}
                                    >
                                        audiotrack
                                    </i>{' '}
                                    {showAnswer && <div className="right-answer">right Answer</div>}
                                </div>
                                <div className="answers">
                                    <div
                                        className="answer"
                                        aria-hidden
                                        onClick={() => {
                                            setShowAnswer(!showAnswer);
                                        }}
                                    >
                                        qqqqqqqqqq
                                    </div>
                                    <div
                                        className="answer"
                                        aria-hidden
                                        onClick={() => {
                                            setShowAnswer(!showAnswer);
                                        }}
                                    >
                                        wwwwwwwwww
                                    </div>
                                    <div
                                        className="answer"
                                        aria-hidden
                                        onClick={() => {
                                            setShowAnswer(!showAnswer);
                                        }}
                                    >
                                        eeeeeeeeee
                                    </div>
                                    <div
                                        className="answer"
                                        aria-hidden
                                        onClick={() => {
                                            setShowAnswer(!showAnswer);
                                        }}
                                    >
                                        rrrrrrrrrr
                                    </div>
                                    <div
                                        className="answer"
                                        aria-hidden
                                        onClick={() => {
                                            setShowAnswer(!showAnswer);
                                        }}
                                    >
                                        tttttttttt
                                    </div>
                                </div>
                                {showAnswer && (
                                    <div className="btn-next" aria-hidden onClick={nextQuestion}>
                                        Следующий
                                    </div>
                                )}
                                <article>game</article>
                                <div
                                    className="btn-end"
                                    aria-hidden
                                    onClick={() => {
                                        setShow(!show);
                                    }}
                                >
                                    Закончить игру
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AudioGame;
