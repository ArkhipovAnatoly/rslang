import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import './Sprint.css';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Header from '../../Home/Header';
import Menu from '../../Menu/Menu';
import Footer from '../../Home/Footer';
import Service, { DataWord } from '../../../Service';
import shuffle from '../../../Utils/shaffleArray';
import getRandomNumber from '../../../Utils/random';

const Sprint = () => {
    const { group, page } = useParams();
    const [words, setWords] = useState<DataWord[]>([]);
    const [showMain, setShowMain] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [wordsToGuess, setWordsToGuess] = useState<DataWord[]>([]);
    const [correctWordId, setCorrectWordId] = useState<string>('');
    const [correctText, setCorrectText] = useState<string>('');
    const [textTranslate, setTextTranslate] = useState<string>('');
    const [wordIndex, setWordIndex] = useState<number>(0);
    const [className, setClassName] = useState<string>('answer');
    const [scoreRight, setScoreRight] = useState<number>(0);
    const [menuActive, setMenuActive] = useState<boolean>(false);
    const navigator = useNavigate();

    const generateWordsToGuess = () => {
        setClassName('answer');
        setShowAnswer(true);
        setShowMain(false);
        setCorrectWordId(words[wordIndex].id);
        setCorrectText('');
        setTextTranslate('');
        setCorrectText(words[wordIndex].word as string);

        const arr: DataWord[] = [];
        const generated: number[] = [];
        let num = 0;

        arr.push(words[wordIndex]);

        do {
            num = getRandomNumber(20);
        } while (generated.includes(num) || num === wordIndex);

        generated.push(num);
        arr.push(words[num]);

        setTextTranslate(words[num].wordTranslate);

        const shuffledWordsToGuess = shuffle(arr);

        setWordsToGuess(shuffledWordsToGuess);
        setWordIndex(wordIndex + 1);
        setClassName('answer show');
    };

    const handlerGroup = (event: React.MouseEvent) => {
        const { dataset } = event.target as HTMLDivElement;

        switch (dataset.group) {
            case '1':
                navigator('/sprint/1/1');
                generateWordsToGuess();
                break;
            case '2':
                navigator('/sprint/2/1');
                generateWordsToGuess();
                break;
            case '3':
                navigator('/sprint/3/1');
                generateWordsToGuess();
                break;
            case '4':
                navigator('/sprint/4/1');
                generateWordsToGuess();
                break;
            case '5':
                navigator('/sprint/5/1');
                generateWordsToGuess();
                break;
            case '6':
                navigator('/sprint/6/1');
                generateWordsToGuess();
                break;
            default:
                break;
        }

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

    const viewRightAnswer = (event: React.MouseEvent) => {
        const { dataset } = event.target as HTMLDivElement;

        if (dataset.answer === correctWordId) {
            console.log('true');
            setScoreRight(scoreRight + 1);
        } else {
            console.log('false');
            // ещё нужно сохранять слова для отображения в конце!
        }

        generateWordsToGuess();
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
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
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
                                <h1>Игра Спринт</h1>
                                <h2>
                                    Выберите уровень сложности
                                </h2>
                                <div
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
                                <div className="game-question">
                                    <div className="score">
                                        Количество правильных ответов
                                        <span className="score-right">{scoreRight}</span>
                                    </div>

                                    <div className="timer">
                                        <CountdownCircleTimer
                                            isPlaying
                                            duration={30}
                                            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                            colorsTime={[20, 10, 5, 0]}
                                        >
                                            {({ remainingTime }) => remainingTime}
                                        </CountdownCircleTimer>
                                    </div>
                                    <div className="question-container">
                                        <div className="question">{correctText}</div>
                                        <span className="this">ЭТО</span>
                                        <div className="question">{textTranslate}</div>
                                    </div>
                                </div>

                                <div className="btns" onClick={viewRightAnswer} aria-hidden>
                                    {wordsToGuess.map((word) => (
                                        <div key={word.id} data-answer={word.id} className={className} aria-hidden>
                                            {word.wordTranslate}
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className="btn-exit"
                                    aria-hidden
                                    onClick={() => {
                                        setShowAnswer(false);
                                        setShowMain(true);
                                        setWordIndex(0);
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

export default Sprint;
