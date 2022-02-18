import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Sprint.css';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Header from '../../Home/Header';
import Menu from '../../Menu/Menu';
import Footer from '../../Home/Footer';
import Service, { DataAggregatedWordsById, DataWord } from '../../../Service';
import shuffle from '../../../Utils/shuffleArray';
import getRandomNumber from '../../../Utils/random';

const Sprint = () => {
    const navigator = useNavigate();
    const { group, page } = useParams();
    const [words, setWords] = useState<DataWord[]>([]);
    const [showMain, setShowMain] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [wordsToGuess, setWordsToGuess] = useState<DataWord[]>([]);
    const [answer, setAnswer] = useState<string>('');
    const [questionWord, setQuestionWord] = useState<string>('');
    const [questionWordTranslate, setQuestionWordTranslate] = useState<string>('');
    const [wordIndex, setWordIndex] = useState<number>(0);
    const [className, setClassName] = useState<string>('answer');
    const [scoreRight, setScoreRight] = useState<number>(0);
    const [menuActive, setMenuActive] = useState<boolean>(false);
    const [groupText, setGroupText] = useState<string>('');
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [wordLength, setWordLength] = useState<number>(-1);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [correctWordId, setCorrectWordId] = useState<string>('');
    const [guessedWordsIDs, setGuessedWordsIDs] = useState<string[]>([]);
    const [notGuessedWordsIDs, setNotGuessedWordsIDs] = useState<string[]>([]);
    const [isDisabledStart, setIsDisabledStart] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        if (token !== null && userId !== null) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    const handlerGroup = (event: React.MouseEvent) => {
        const { dataset } = event.target as HTMLDivElement;

        if (!dataset.group) {
            return;
        }

        setCurrentGroup(+dataset.group);
        setIsDisabledStart(false);
    };

    const fetchPartialWords = useCallback(async () => {
        let wordsPartial: DataWord[] = [];
        if (group && page) {
            wordsPartial = (await Service.getWords(+(group as string) - 1, +(page as string) - 1)) as DataWord[];
        } else {
            wordsPartial = (await Service.getWords(currentGroup - 1, currentPage)) as DataWord[];
        }

        if (isAuth && group && page) {
            const token = localStorage.getItem('token') as string;
            const userId = localStorage.getItem('userId') as string;
            const learnedWords = (await Service.aggregatedWords(
                {
                    userId,
                    group: '',
                    page: '',
                    wordsPerPage: '20',
                    filter: `{"$and":[{"userWord.difficulty":"learned", "userWord.optional.testFieldBoolean":${true}}]}`,
                },
                token
            )) as DataWord[];
            if (typeof learnedWords === 'number') {
                setIsAuth(false);
                localStorage.clear();
                navigator('/authorization');
                return;
            }
            const learnedWordsFiltered = learnedWords.filter((v) => v.group === +group - 1 && v.page === +page - 1);

            learnedWordsFiltered.forEach((v) => {
                wordsPartial.forEach((k, i) => {
                    if (k.id === v._id) {
                        wordsPartial.splice(i, 1);
                    }
                });
            });
            if (learnedWords.length !== 0 && learnedWords.length < 20 && +page !== 1) {
                const allLearned = (await Service.aggregatedWords(
                    {
                        userId,
                        group: '',
                        page: '',
                        wordsPerPage: '',
                        filter: `{"$and":[{"userWord.difficulty":"learned", "userWord.optional.testFieldBoolean":${true}}]}`,
                    },
                    token
                )) as DataWord[];
                const prevPageLearnedWords = allLearned.filter((v) => v.group === +group - 1 && v.page === +page - 2);
                const isPrevPageLearned = prevPageLearnedWords.length === 20;
                if (!isPrevPageLearned) {
                    const extraWords = (await Service.getWords(
                        +(group as string) - 1,
                        +(page as string) - 2
                    )) as DataWord[];
                    const extraWordsShuffled = shuffle(extraWords);
                    for (let index = 0; index < learnedWordsFiltered.length; index += 1) {
                        wordsPartial.push(extraWordsShuffled[index]);
                    }
                }
            }
        }
        const shuffledWords = shuffle(wordsPartial);
        setWords(shuffledWords);
        setWordLength(wordsPartial.length);
    }, [currentPage, group, page, currentGroup, isAuth, navigator]);

    useEffect(() => {
        fetchPartialWords();
    }, [fetchPartialWords]);

    const generateWordsToGuess = useCallback(() => {
        let num: number = 0;
        const arr: DataWord[] = [];
        const generated: number[] = [];
        setClassName('answer');
        setShowAnswer(true);
        setShowMain(false);
        setQuestionWord(words[wordIndex].word);
        setCorrectWordId(words[wordIndex].id);

        arr.push(words[wordIndex]);

        do {
            num = getRandomNumber(20);
        } while (generated.includes(num));

        generated.push(num);
        arr.push(words[num]);
        setQuestionWordTranslate(words[num].wordTranslate);

        if (arr[0].id === arr[1].id) {
            setAnswer('YES');
        } else {
            setAnswer('NO');
        }
        setWordsToGuess(arr);
        setWordIndex(wordIndex + 1);
        setClassName('answer show');
    }, [wordIndex, words]);

    const createCorrectWord = useCallback(
        async (wordId: string) => {
            if (isAuth) {
                const token = localStorage.getItem('token') as string;
                const userId = localStorage.getItem('userId') as string;
                const word = (await Service.aggregatedWordsById(
                    { userId, wordId },
                    token
                )) as DataAggregatedWordsById[];
                if (typeof word === 'number') {
                    setIsAuth(false);
                    localStorage.clear();
                    navigator('/authorization');
                }
                if (!word[0]?.userWord) {
                    await Service.createUserWord({ userId, wordId }, token, {
                        difficulty: 'answered',
                        optional: { guessedCount: '1', testFieldBoolean: true },
                    });
                } else {
                    let guessedCount: number = +word[0].userWord.optional.guessedCount || 0;
                    const notGuessedCount: number = +word[0].userWord.optional.notGuessedCount || 0;
                    guessedCount += 1;
                    if (word[0]?.userWord?.difficulty === 'hard' && guessedCount >= 5 && notGuessedCount <= 1) {
                        const optional = word[0]?.userWord.optional;
                        await Service.updateUserWord({ userId, wordId }, token, {
                            difficulty: 'learned',
                            optional: { ...optional, guessedCount: `${guessedCount}` },
                        });
                    } else if (
                        word[0]?.userWord?.difficulty === 'answered' &&
                        guessedCount >= 3 &&
                        notGuessedCount <= 1
                    ) {
                        const optional = word[0]?.userWord.optional;
                        await Service.updateUserWord({ userId, wordId }, token, {
                            difficulty: 'learned',
                            optional: { ...optional, guessedCount: `${guessedCount}` },
                        });
                    } else {
                        const optional = word[0]?.userWord.optional;
                        await Service.updateUserWord({ userId, wordId }, token, {
                            difficulty: 'answered',
                            optional: { ...optional, guessedCount: `${guessedCount}` },
                        });
                    }
                }
            }
        },
        [isAuth, navigator]
    );

    const createIncorrectWord = useCallback(
        async (wordId: string) => {
            if (isAuth) {
                const token = localStorage.getItem('token') as string;
                const userId = localStorage.getItem('userId') as string;
                const word = (await Service.aggregatedWordsById(
                    { userId, wordId },
                    token
                )) as DataAggregatedWordsById[];
                if (typeof word === 'number') {
                    setIsAuth(false);
                    localStorage.clear();
                    navigator('/authorization');
                }

                if (!word[0]?.userWord) {
                    await Service.createUserWord({ userId, wordId }, token, {
                        difficulty: 'answered',
                        optional: { notGuessedCount: '1', testFieldBoolean: true },
                    });
                } else {
                    let notGuessedCount: number = +word[0].userWord.optional.notGuessedCount || 0;
                    const optional = word[0]?.userWord.optional;
                    notGuessedCount += 1;
                    await Service.updateUserWord({ userId, wordId }, token, {
                        difficulty: 'answered',
                        optional: { ...optional, notGuessedCount: `${notGuessedCount}` },
                    });
                }
            }
        },
        [isAuth, navigator]
    );

    const checkAnswer = useCallback(
        (event?: React.MouseEvent, key?: string) => {
            const target = event?.target as HTMLDivElement;
            let variantWordId: string = '';
            let variantAnswer: string = '';

            if (target) {
                const { dataset } = target;
                if (!dataset.id) return;
                variantWordId = dataset.id;
                variantAnswer = dataset.answer as string;
            } else if (key) {
                variantWordId = wordsToGuess[+key - 1].id;
                variantAnswer = key === '1' ? 'YES' : 'NO';
            }

            if (variantAnswer === answer) {
                setScoreRight(scoreRight + 1);
                setGuessedWordsIDs([...guessedWordsIDs, variantWordId]);
                createCorrectWord(variantWordId as string);
            } else {
                setNotGuessedWordsIDs([...notGuessedWordsIDs, correctWordId]);
                createIncorrectWord(correctWordId);
            }

            setWordIndex(wordIndex + 1);
            generateWordsToGuess();
        },
        [
            answer,
            correctWordId,
            createCorrectWord,
            createIncorrectWord,
            generateWordsToGuess,
            guessedWordsIDs,
            notGuessedWordsIDs,
            scoreRight,
            wordIndex,
            wordsToGuess,
        ]
    );

    useEffect(() => {
        if (wordIndex === wordLength - 1) {
            setWordIndex(0);
            setIsFinished(true);
            setShowMain(false);
        }
    }, [wordIndex, wordLength]);

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

    useMemo(() => {
        switch (currentGroup) {
            case 1:
                setGroupText('Выбраны слова уровня A1');
                break;
            case 2:
                setGroupText('Выбраны слова уровня A2');
                break;
            case 3:
                setGroupText('Выбраны слова уровня B1');
                break;
            case 4:
                setGroupText('Выбраны слова уровня B2');
                break;
            case 5:
                setGroupText('Выбраны слова уровня C1');
                break;
            case 6:
                setGroupText('Выбраны слова уровня C2');
                break;

            default:
                break;
        }
    }, [currentGroup]);

    useMemo(() => {
        switch (group) {
            case '1':
                setGroupText('Слова уровня A1');
                break;
            case '2':
                setGroupText('Слова уровня A2');
                break;
            case '3':
                setGroupText('Слова уровня B1');
                break;
            case '4':
                setGroupText('Слова уровня B2');
                break;
            case '5':
                setGroupText('Слова уровня C1');
                break;
            case '6':
                setGroupText('Слова уровня C2');
                break;

            default:
                break;
        }
    }, [group]);

    useEffect(() => {
        const keyBoardHandler = (event: KeyboardEvent) => {
            if (showMain && event.code === 'Enter') {
                generateWordsToGuess();
            }
            if (event.code === 'Escape' && showAnswer) {
                setIsFinished(true);
                setClassName('');
            } else if (showMain && +event.key >= 1 && +event.key <= 6) {
                setCurrentGroup(+event.key);
                setIsDisabledStart(false);
            } else if (showAnswer && (+event.key === 1 || +event.key === 2)) {
                checkAnswer(undefined, `${event.key}`);
            }
        };
        document.addEventListener('keydown', keyBoardHandler);

        return () => {
            document.removeEventListener('keydown', keyBoardHandler);
        };
    }, [showMain, showAnswer, checkAnswer, generateWordsToGuess]);

    return (
        <div className="games-page">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
            <div className="card">
                <div className="card-content">
                    <div className="game-content">
                        {showMain && (
                            <div>
                                <h1>Игра Спринт</h1>
                                <h2 style={{ display: group && page ? 'none' : 'block' }}>
                                    Выберите уровень сложности
                                </h2>
                                <div
                                    style={{ display: group && page ? 'none' : 'flex' }}
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
                                <span className="group-text"> {!group ? groupText : groupText} </span>
                            </div>
                        )}
                        <button
                            className="btn-start"
                            style={{ display: showMain ? 'block' : 'none' }}
                            aria-hidden
                            disabled={group && page ? false : isDisabledStart}
                            type="button"
                            onClick={generateWordsToGuess}
                        >
                            Начать игру (Enter)
                        </button>

                        {showAnswer && (
                            <div className="game-container">
                                {isFinished && (
                                    <div className="result">
                                        <i
                                            title="Выход"
                                            style={{ cursor: 'pointer' }}
                                            aria-hidden
                                            className="material-icons align-left"
                                            onClick={() => {
                                                setIsFinished(false);
                                                setShowAnswer(false);
                                                setShowMain(true);
                                                setWordIndex(0);
                                                setCurrentPage(0);
                                                setCurrentGroup(0);
                                                setGuessedWordsIDs([]);
                                                setNotGuessedWordsIDs([]);
                                                setIsDisabledStart(true);
                                                setGroupText('');
                                            }}
                                        >
                                            close
                                        </i>
                                        <i
                                            title="Продолжить"
                                            style={{ cursor: 'pointer' }}
                                            aria-hidden
                                            className="material-icons align-left"
                                            onClick={() => {
                                                setIsFinished(false);
                                            }}
                                        >
                                            play_arrow
                                        </i>

                                        <h4 className="result-title">Результаты</h4>
                                        <div className="result-info">
                                            <table className="highlight">
                                                <thead>
                                                    <tr>
                                                        <th style={{ color: 'green' }}>Знаю</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {guessedWordsIDs.length ? (
                                                        guessedWordsIDs.map((wordID) => {
                                                            const index = words.findIndex((word) => word.id === wordID);
                                                            if (index !== -1) {
                                                                return (
                                                                    <tr key={Math.random() * 1000}>
                                                                        <td
                                                                            key={words[index].id}
                                                                            className="collection-item"
                                                                        >
                                                                            {words[index].word} -{' '}
                                                                            {words[index].wordTranslate}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            return null;
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td>Тут пусто</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                            <table className="highlight">
                                                <thead>
                                                    <tr>
                                                        <th style={{ color: 'red' }}>Не Знаю</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {notGuessedWordsIDs.length ? (
                                                        notGuessedWordsIDs.map((wordID) => {
                                                            const index = words.findIndex((word) => word.id === wordID);
                                                            if (index !== -1) {
                                                                return (
                                                                    <tr key={Math.random() * 1000}>
                                                                        <td
                                                                            key={words[index].id}
                                                                            className="collection-item"
                                                                        >
                                                                            {words[index].word} -{' '}
                                                                            {words[index].wordTranslate}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            return null;
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td>Тут пусто</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
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
                                        <div className="question">{questionWord}</div>
                                        <span className="this">ЭТО</span>
                                        <div className="question">{questionWordTranslate}</div>
                                    </div>
                                </div>

                                <div className="btns" onClick={checkAnswer} aria-hidden>
                                    {wordsToGuess.map((v, i) => (
                                        <div
                                            key={Math.random() * 1000}
                                            data-id={v.id}
                                            data-answer={i === 0 ? 'YES' : 'NO'}
                                            className={className}
                                            aria-hidden
                                        >
                                            {i === 0 ? `(${i + 1}). ДА` : `(${i + 1}).НЕТ`}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="btn-exit"
                                    aria-hidden
                                    onClick={() => {
                                        setIsFinished(true);
                                        setScoreRight(0);
                                    }}
                                    type="button"
                                >
                                    Закончить игру (Esc)
                                </button>
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
