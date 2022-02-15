import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import './AudioGame.css';

import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import Service, { DataWord } from '../../../Service';
import shuffle from '../../../Utils/shaffleArray';
import getRandomNumber from '../../../Utils/random';

const guessedWordsIDs: string[] = [];
const notGuessedWordsIDs: string[] = [];
const AudioGame = () => {
    const { group, page } = useParams();
    const [words, setWords] = useState<DataWord[]>([]);
    const [showMain, setShowMain] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [wordsToGuess, setWordsToGuess] = useState<DataWord[]>([]);
    const [correctWord, setCorrectWord] = useState<DataWord>();
    const [correctWordId, setCorrectWordId] = useState<string>('');
    const [correctText, setCorrectText] = useState<string>('');
    const [wordIndex, setWordIndex] = useState<number>(0);
    const [imgSrc, setImgSrc] = useState<string>('');
    const [className, setClassName] = useState<string>('answer');
    // const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const player = new Audio();

    /*     useEffect(() => {
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        if (token !== null && userId !== null) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []); */

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
            console.log(`page = ${currentPage}`);
        }
        const shuffledWords = shuffle(wordsPartial);
        setWords(shuffledWords);
    }, [currentPage, group, page, currentGroup]);

    useEffect(() => {
        fetchPartialWords();
    }, [fetchPartialWords]);

    const generateWordsToGuess = () => {
        setClassName('answer');
        setShowAnswer(true);
        setShowMain(false);
        setCorrectWord(words[wordIndex]);
        setCorrectWordId(words[wordIndex].id);
        setCorrectText('');
        setImgSrc('');

        const audioUrl = `https://learn-english-words-app.herokuapp.com/${words[wordIndex].audio}`;
        player.src = audioUrl;
        player.play();
        const arr: DataWord[] = [];
        const generated: number[] = [];
        arr.push(words[wordIndex]);
        let num = 0;
        for (let index = 0; index < 4; index += 1) {
            do {
                num = getRandomNumber(20);
            } while (generated.includes(num) || num === wordIndex);
            generated.push(num);
            arr.push(words[num]);
        }
        const shuffledWordsToGuess = shuffle(arr);
        setWordsToGuess(shuffledWordsToGuess);
        setWordIndex(wordIndex + 1);
        setTimeout(() => {
            setClassName('answer show');
        }, 500);
    };

    const checkAnswer = (event: React.MouseEvent) => {
        const { dataset } = event.target as HTMLDivElement;
        if (!dataset.answer) return;
        const variantWordId = dataset.answer;
        const imgUrl = `https://learn-english-words-app.herokuapp.com/${correctWord?.image}`;
        if (variantWordId === correctWordId) {
            setImgSrc(imgUrl);
            guessedWordsIDs.push(variantWordId);
            console.log(guessedWordsIDs);
        } else {
            setImgSrc(imgUrl);
            setCorrectText(correctWord?.wordTranslate as string);
            notGuessedWordsIDs.push(variantWordId);
        }
    };

    useEffect(() => {
        if (wordIndex === 5) {
            setWordIndex(0);
            // setCurrentPage(currentPage + 1);
            setShowMain(false);
            setIsFinished(true);
        }
    }, [wordIndex, currentPage]);

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
                            <div>
                                <h1>Игра Аудиовызов</h1>
                                <h2 style={{ display: group && page ? 'block' : 'none' }}>
                                    Выберите уровень сложности
                                </h2>
                                <div
                                    style={{ display: group && page ? 'flex' : 'none' }}
                                    className="groups"
                                    aria-hidden
                                    onClick={handlerGroup}
                                >
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
                        <div
                            className="btn-start"
                            style={{ display: showMain ? 'block' : 'none' }}
                            aria-hidden
                            onClick={generateWordsToGuess}
                        >
                            Начать игру
                        </div>

                        {showAnswer && (
                            <div className="game-container">
                                {isFinished && (
                                    <>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Знаю</th>
                                                    <th>Item Name</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    {guessedWordsIDs.map((wordID) => {
                                                        const index = words.findIndex((word) => word.id === wordID);
                                                        if (index !== -1) {
                                                            return (
                                                                <td key={words[index].id} className="collection-item">
                                                                    {words[index].word}
                                                                    <i
                                                                        aria-hidden
                                                                        style={{ cursor: 'pointer', color: 'red' }}
                                                                        className={`material-icon prefix `}
                                                                    >
                                                                        audiotrack
                                                                    </i>{' '}
                                                                </td>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Не Знаю</th>
                                                    <th>Item Name</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    {notGuessedWordsIDs.map((wordID) => {
                                                        const index = words.findIndex((word) => word.id === wordID);
                                                        if (index !== -1) {
                                                            return (
                                                                <td key={words[index].id} className="collection-item">
                                                                    {words[index].word}
                                                                    <i
                                                                        aria-hidden
                                                                        style={{ cursor: 'pointer', color: 'red' }}
                                                                        className={`material-icon prefix `}
                                                                    >
                                                                        audiotrack
                                                                    </i>{' '}
                                                                </td>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                <div className="audio-question">
                                    {showAnswer && <img src={imgSrc} className="right-image" alt="" />}
                                    <i
                                        aria-hidden
                                        style={{ cursor: 'pointer', color: 'red' }}
                                        className={`material-icon prefix `}
                                    >
                                        audiotrack
                                    </i>{' '}
                                    {showAnswer && <div className="right-answer">{correctText}</div>}
                                </div>

                                <div className="answers" aria-hidden onClick={checkAnswer}>
                                    {wordsToGuess.map((word) => (
                                        <div key={word.id} data-answer={word.id} className={className} aria-hidden>
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
                                        setShowAnswer(false);
                                        setShowMain(true);
                                        setWordIndex(0);
                                        setCurrentPage(0);
                                        setCurrentGroup(0);
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
