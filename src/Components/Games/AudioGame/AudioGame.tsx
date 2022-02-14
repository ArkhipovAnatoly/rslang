import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import './AudioGame.css';

import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import Service, { DataWord } from '../../../Service';
import shuffle from '../../../Utils/shaffleArray';
import getRandomNumber from '../../../Utils/random';

const AudioGame = () => {
    const { group, page } = useParams();
    const [words, setWords] = useState<DataWord[]>([]);
    const [show, setShow] = useState(false);
    const [showMain, setShowMain] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [wordsToGuess, setWordsToGuess] = useState<DataWord[]>([]);
    const [correctWordId, setCorrectWordId] = useState<string>('');
    const [wordIndex, setWordIndex] = useState<number>(0);

    const player = new Audio();

    const handlerGroup = (event: React.MouseEvent) => {
        const { dataset } = event.target as HTMLDivElement;
        if (!dataset.group) {
            return;
        }

        setCurrentGroup(+dataset.group);
    };

    const fetchPartialWords = useCallback(async () => {
        let wordsPartial: DataWord[] = [];
        if (group && page) {
            wordsPartial = (await Service.getWords(+(group as string) - 1, +(page as string) - 1)) as DataWord[];
        } else {
            wordsPartial = (await Service.getWords(currentGroup, currentPage)) as DataWord[];
        }
        const shuffledWords = shuffle(wordsPartial);
        setWords(shuffledWords);
    }, [currentPage, group, page, currentGroup]);

    useEffect(() => {
        fetchPartialWords();
    }, [fetchPartialWords]);

    const generateWordsToGuess = () => {
        setShowAnswer(true);
        setShow(true);
        setCorrectWordId(words[wordIndex].id);
        const audioUrl = `https://learn-english-words-app.herokuapp.com/${words[wordIndex].audio}`;
        player.src = audioUrl;
        player.play();
        const arr: DataWord[] = [];
        const generated: number[] = [];
        arr.push(words[wordIndex]);
        let num = 0;
        for (let index = 0; index < 4; index += 1) {
            num = getRandomNumber(20);
            if (generated.includes(num) || num === wordIndex) {
                num = getRandomNumber(20);
            } else {
                generated.push(num);
            }
            arr.push(words[num]);
        }
        const shuffledWordsToGuess = shuffle(arr);
        setWordsToGuess(shuffledWordsToGuess);
        setWordIndex(wordIndex + 1);
    };

    const checkAnswer = (event: React.MouseEvent) => {
        const { dataset } = event.target as HTMLDivElement;
        if (!dataset.answer) return;
        const variantWordId = dataset.answer;
        if (variantWordId === correctWordId) {
            console.log('You are rigth');
        } else {
            console.log('You are wrong');
        }
    };

    useEffect(() => {
        if (group && page && wordIndex === 20) {
            setCurrentPage(currentPage + 1);
        }
        if (wordIndex === 20) {
            setWordIndex(0);
        }
    }, [wordIndex, currentPage, group, page]);

    useEffect(() => {
        if (currentPage === 30) {
            setCurrentPage(0);
            setCurrentGroup(currentGroup + 1);
            if (currentGroup === 6) {
                setCurrentGroup(0);
            }
        }
    }, [currentPage, currentGroup]);

    return (
        <div className="games-page">
            <Header />
            <div className="card">
                <div className="card-content">
                    <div className="game-content">
                        {showMain && (
                            <div
                                aria-hidden
                                onClick={() => {
                                    setShowMain(!showMain);
                                }}
                            >
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
                            </div>
                        )}
                        <div className="btn-start" aria-hidden onClick={generateWordsToGuess}>
                            Начать игру
                        </div>

                        {show && (
                            <div className="game-container">
                                <div className="audio-question">
                                    {showAnswer && <div className="right-image">image</div>}
                                    <i
                                        aria-hidden
                                        style={{ cursor: 'pointer', color: 'red' }}
                                        className={`material-icon prefix `}
                                    >
                                        audiotrack
                                    </i>{' '}
                                    {showAnswer && <div className="right-answer">right Answer</div>}
                                </div>
                                <div className="answers" aria-hidden onClick={checkAnswer}>
                                    {wordsToGuess.map((word) => (
                                        <div key={word.id} data-answer={word.id} className="answer" aria-hidden>
                                            {word.wordTranslate}
                                        </div>
                                    ))}
                                </div>
                                {showAnswer && (
                                    <div className="btn-next" aria-hidden onClick={generateWordsToGuess}>
                                        Следующий
                                    </div>
                                )}
                                <article>game</article>
                                <div
                                    className="btn-end"
                                    aria-hidden
                                    onClick={() => {
                                        setShow(!show);
                                        setShowMain(!showMain);
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
