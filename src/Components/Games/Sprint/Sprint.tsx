import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Sprint.css';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Header from '../../Home/Header';
import Menu from '../../Menu/Menu';
import Service, { DataAggregatedWordsById, DataStat, DataWord } from '../../../Service';
import shuffle from '../../../Utils/shuffleArray';
import getRandomNumber from '../../../Utils/random';

/* let dataStat: DataStat = {
    learnedWords: 0,
    optional: {
        newWordsAudioGame: 0,
        newWordsSprintGame: 0,
        wordsInRowAudioGame: 0,
        wordsInRowSprintGame: 0,
        totalQuestionsAudioGame: 0,
        totalQuestionSprintGame: 0,
        totalCorrectAnswersAudioGame: 0,
        totalCorrectAnswersSprintGame: 0,
    },
}; */

let answersInRow = 0;
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
    const [scoreRight, setScoreRight] = useState<number>(0);
    const [menuActive, setMenuActive] = useState<boolean>(false);
    const [groupText, setGroupText] = useState<string>('');
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [correctWordId, setCorrectWordId] = useState<string>('');
    const [guessedWordsIDs, setGuessedWordsIDs] = useState<string[]>([]);
    const [notGuessedWordsIDs, setNotGuessedWordsIDs] = useState<string[]>([]);
    const [isDisabledStart, setIsDisabledStart] = useState<boolean>(true);
    const [timerStart, setTimerStart] = useState<boolean>(true);
    const [classResult, setClassResult] = useState<string>('');
    const [key, setKey] = useState(0);
    const [guessedWords, setGuessedWords] = useState<DataWord[]>([]);
    const [notGuessedWords, setNotGuessedWords] = useState<DataWord[]>([]);
    let [learns] = useState<string| null>('');

    const getLocalStorage = () => {
        learns = localStorage.getItem('pageLearn');
    }

    useEffect(() => {
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        if (token !== null && userId !== null) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
        answersInRow = 0;
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

        getLocalStorage();
        if(learns === 'true') {
            navigator(`/book/${group}/${page}/pageExplored`);
        }

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
    }, [currentPage, group, page, currentGroup, isAuth, navigator]);

    useEffect(() => {
        fetchPartialWords();
    }, [fetchPartialWords]);

    const generateWordsToGuess = useCallback(async () => {
        setTimerStart(true);
        let num: number = 0;
        let helper: number = 0;
        let arr: DataWord[] = [];
        const generated: number[] = [];
        setShowAnswer(true);
        setShowMain(false);
        setQuestionWord(words[wordIndex].word);
        setCorrectWordId(words[wordIndex].id);

        arr.push(words[wordIndex]);

        do {
            num = getRandomNumber(18);
            helper = getRandomNumber(18);
        } while (generated.includes(num));
        arr.push(words[num]);
        generated.push(num);
        setQuestionWordTranslate(words[num].wordTranslate);

        if (helper % 2 === 0) {
            arr = [];
            arr.push(words[wordIndex]);
            do {
                num = getRandomNumber(18);
                arr[1] = words[num];
                setQuestionWordTranslate(words[num].wordTranslate);
            } while (arr[0].id !== arr[1].id);
        }

        if (arr[0].id === arr[1].id) {
            setAnswer('YES');
        } else {
            setAnswer('NO');
        }

        setWordsToGuess(arr);
        setWordIndex(wordIndex + 1);
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

                let responseStat = (await Service.getUserStat(userId, token)) as DataStat;
                delete responseStat.id;
                let { optional } = responseStat;
                const { learnedWords } = responseStat;
                let { wordsInRowSprintGame } = optional;

                if (answersInRow > wordsInRowSprintGame) {
                    wordsInRowSprintGame = answersInRow;
                }

                const totalCorrectAnswersSprintGame = optional.totalCorrectAnswersSprintGame + 1;
                const totalQuestionsSprintGame = optional.totalQuestionsSprintGame + 1;

                optional = {
                    ...optional,
                    wordsInRowSprintGame,
                    totalCorrectAnswersSprintGame,
                    totalQuestionsSprintGame,
                };
                let dataStatUpdate = { ...responseStat, optional };
                setTimeout(async () => {
                    await Service.updateUserStat(dataStatUpdate, userId, token);
                }, 100);

                if (!word[0]?.userWord) {
                    await Service.createUserWord({ userId, wordId }, token, {
                        difficulty: 'answered',
                        optional: { guessedCount: '1', inGame: true, testFieldBoolean: true },
                    });
                    const newWordsSprintGame = optional.newWordsSprintGame + 1;
                    optional = { ...optional, newWordsSprintGame };
                    dataStatUpdate = { ...responseStat, optional };
                    setTimeout(async () => {
                        await Service.updateUserStat(dataStatUpdate, userId, token);
                    }, 100);
                } else {
                    let guessedCount: number = +word[0].userWord.optional.guessedCount || 0;
                    const notGuessedCount: number = +word[0].userWord.optional.notGuessedCount || 0;
                    guessedCount += 1;
                    if (word[0].userWord.difficulty === 'hard' && guessedCount >= 5 && notGuessedCount <= 1) {
                        const optionalUserWord = word[0].userWord.optional;
                        await Service.updateUserWord({ userId, wordId }, token, {
                            difficulty: 'learned',
                            optional: { ...optionalUserWord, guessedCount: `${guessedCount}` },
                        });

                        const learnedWordsUpdate = learnedWords + 1;
                        responseStat = (await Service.getUserStat(userId, token)) as DataStat;
                        delete responseStat.id;
                        dataStatUpdate = { ...responseStat, learnedWords: learnedWordsUpdate };
                        setTimeout(async () => {
                            await Service.updateUserStat(dataStatUpdate, userId, token);
                        }, 100);
                    } else if (
                        word[0].userWord.difficulty === 'answered' &&
                        guessedCount >= 3 &&
                        notGuessedCount <= 1
                    ) {
                        const { optional: optionalUserWord } = word[0].userWord;
                        await Service.updateUserWord({ userId, wordId }, token, {
                            difficulty: 'learned',
                            optional: { ...optionalUserWord, guessedCount: `${guessedCount}` },
                        });
                        const learnedWordsUpdate = learnedWords + 1;
                        responseStat = (await Service.getUserStat(userId, token)) as DataStat;
                        delete responseStat.id;
                        dataStatUpdate = { ...responseStat, learnedWords: learnedWordsUpdate };
                        setTimeout(async () => {
                            await Service.updateUserStat(dataStatUpdate, userId, token);
                        }, 100);
                    } else {
                        const { optional: optionalUserWord } = word[0].userWord;
                        await Service.updateUserWord({ userId, wordId }, token, {
                            difficulty: 'answered',
                            optional: { ...optionalUserWord, guessedCount: `${guessedCount}` },
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
                let responseStat = (await Service.getUserStat(userId, token)) as DataStat;
                delete responseStat.id;
                let { optional } = responseStat;
                const { learnedWords } = responseStat;
                const wordsInRowSprintGame = 0;
                const totalQuestionsSprintGame = optional.totalQuestionsSprintGame + 1;

                optional = {
                    ...optional,
                    wordsInRowSprintGame,
                    totalQuestionsSprintGame,
                };
                let dataStatUpdate = { ...responseStat, optional };
                setTimeout(async () => {
                    await Service.updateUserStat(dataStatUpdate, userId, token);
                }, 100);

                if (!word[0]?.userWord) {
                    await Service.createUserWord({ userId, wordId }, token, {
                        difficulty: 'answered',
                        optional: { notGuessedCount: '1', inGame: true, testFieldBoolean: true },
                    });

                    const newWordsSprintGame = optional.newWordsSprintGame + 1;
                    optional = { ...optional, newWordsSprintGame };
                    dataStatUpdate = { ...responseStat, optional };
                    setTimeout(async () => {
                        await Service.updateUserStat(dataStatUpdate, userId, token);
                    }, 100);
                } else {
                    if (word[0].userWord.difficulty === 'learned') {
                        const learnedWordsUpdate = learnedWords - 1;
                        responseStat = (await Service.getUserStat(userId, token)) as DataStat;
                        delete responseStat.id;
                        dataStatUpdate = { ...responseStat, learnedWords: learnedWordsUpdate };
                        setTimeout(async () => {
                            await Service.updateUserStat(dataStatUpdate, userId, token);
                        }, 100);
                    }
                    let notGuessedCount: number = +word[0].userWord.optional.notGuessedCount || 0;
                    const { optional: optionalUserWord } = word[0].userWord;
                    notGuessedCount += 1;
                    await Service.updateUserWord({ userId, wordId }, token, {
                        difficulty: 'answered',
                        optional: { ...optionalUserWord, notGuessedCount: `${notGuessedCount}` },
                    });
                }
            }
        },
        [isAuth, navigator]
    );

    const checkAnswer = useCallback(
        (event?: React.MouseEvent, k?: string) => {
            const target = event?.target as HTMLDivElement;
            let variantWordId: string = '';
            let variantAnswer: string = '';

            if (target) {
                const { dataset } = target;
                if (!dataset.id) return;
                variantWordId = dataset.id;
                variantAnswer = dataset.answer as string;
            } else if (k) {
                variantWordId = wordsToGuess[+k - 1].id;
                variantAnswer = k === '1' ? 'YES' : 'NO';
            }

            if (variantAnswer === answer) {
                setScoreRight(scoreRight + 1);
                setGuessedWordsIDs([...guessedWordsIDs, variantWordId]);
                const word = words.find((w) => w.id === variantWordId) as DataWord;
                setGuessedWords([...guessedWords, word]);
                createCorrectWord(variantWordId);
                if (isAuth) {
                    answersInRow += 1;
                }
            } else {
                setNotGuessedWordsIDs([...notGuessedWordsIDs, correctWordId]);
                const word = words.find((w) => w.id === correctWordId) as DataWord;
                setNotGuessedWords([...notGuessedWords, word]);
                createIncorrectWord(correctWordId);
                answersInRow = 0;
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
            guessedWords,
            notGuessedWords,
            words,
            isAuth,
        ]
    );

    useEffect(() => {
        if (wordIndex === 20) {
            setWordIndex(0);
        }
    }, [wordIndex]);

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
                setClassResult('visible');
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

    const initStatistic = useCallback(async () => {
        if (isAuth) {
            const token = localStorage.getItem('token') as string;
            const userId = localStorage.getItem('userId') as string;
            const responseStat = (await Service.getUserStat(userId, token)) as DataStat;
            if (typeof responseStat === 'number' && responseStat === 404) {
                await Service.updateUserStat(
                    {
                        learnedWords: 0,
                        optional: {
                            newWordsAudioGame: 0,
                            newWordsSprintGame: 0,
                            wordsInRowAudioGame: 0,
                            wordsInRowSprintGame: 0,
                            totalQuestionsAudioGame: 0,
                            totalQuestionsSprintGame: 0,
                            totalCorrectAnswersAudioGame: 0,
                            totalCorrectAnswersSprintGame: 0,
                        },
                    },
                    userId,
                    token
                );
            } else if (typeof responseStat === 'number' && responseStat === 401) {
                setIsAuth(false);
                localStorage.clear();
                navigator('/authorization');
            }
        }
    }, [isAuth, navigator]);

    useEffect(() => {
        initStatistic();
    }, [initStatistic]);
    return (
        <div className="game-page">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
            <div className="game">
                <div className="game-sprint">
                    <div className="game-content">
                        {showMain && (
                            <div className="sign">
                                <span className="sign__word">Игра Спринт</span>
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
                                <div className={`result ${classResult}`}>
                                    <div className="btn-main">
                                        <i
                                            title="Выход"
                                            style={{ cursor: 'pointer', color: '#ddd' }}
                                            aria-hidden
                                            className="material-icons medium"
                                            onClick={() => {
                                                setClassResult('');
                                                setShowAnswer(false);
                                                setShowMain(true);
                                                setWordIndex(0);
                                                setCurrentPage(0);
                                                setCurrentGroup(0);
                                                setGuessedWords([]);
                                                setNotGuessedWords([]);
                                                setGuessedWordsIDs([]);
                                                setNotGuessedWordsIDs([]);
                                                setIsDisabledStart(true);
                                                setGroupText('');
                                                answersInRow = 0;
                                                setScoreRight(0);
                                            }}
                                        >
                                            close
                                        </i>
                                        <i
                                            title="Продолжить"
                                            style={{ cursor: 'pointer', color: '#ddd' }}
                                            aria-hidden
                                            className="material-icons medium"
                                            onClick={() => {
                                                setClassResult('');
                                                setTimerStart(true);
                                                setKey((prevKey) => prevKey + 1);
                                                generateWordsToGuess();
                                            }}
                                        >
                                            play_arrow
                                        </i>
                                    </div>

                                    <h4 className="result-title">Результат</h4>
                                    <div className="result-info">
                                        <table className="highlight">
                                            <thead>
                                                <tr>
                                                    <th
                                                        style={{
                                                            color: 'green',
                                                            font: 'bold 20px Vibur, cursive',
                                                        }}
                                                    >
                                                        Знаю
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {guessedWords.length ? (
                                                    guessedWords.map((word) => (
                                                        <tr key={Math.random() * 1000}>
                                                            <td key={word.id} className="collection-item">
                                                                {word.word} - {word.transcription} -{' '}
                                                                {word.wordTranslate}
                                                            </td>
                                                        </tr>
                                                    ))
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
                                                    <th
                                                        style={{
                                                            color: 'red',
                                                            font: 'bold 20px Vibur, cursive',
                                                        }}
                                                    >
                                                        Не Знаю
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notGuessedWords.length ? (
                                                    notGuessedWords.map((word) => (
                                                        <tr key={Math.random() * 1000}>
                                                            <td key={word.id} className="collection-item">
                                                                {word.word} - {word.transcription} -{' '}
                                                                {word.wordTranslate}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td>Тут пусто</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="game-question">
                                    <div className="score">
                                        Количество правильных ответов
                                        <span className="score-right">{scoreRight}</span>
                                        {timerStart}
                                    </div>

                                    <div className="timer">
                                        <CountdownCircleTimer
                                            key={key}
                                            isPlaying={timerStart}
                                            size={100}
                                            duration={30}
                                            colors={['#50C878', '#F4F216', '#F08827', '#EB4C42']}
                                            colorsTime={[25, 10, 5, 0]}
                                            onComplete={() => {
                                                setTimerStart(false);
                                                setClassResult('visible');
                                                setWordIndex(0);
                                                if (!group && !page) {
                                                    setCurrentPage(currentPage + 1);
                                                }

                                                return { shouldRepeat: true };
                                            }}
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
                                            className="answer-sprint"
                                            aria-hidden
                                        >
                                            {i === 0 ? `(${i + 1}) - ДА` : `(${i + 1}) - НЕТ`}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="btn-exit"
                                    aria-hidden
                                    onClick={() => {
                                        setClassResult('visible');
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
        </div>
    );
};

export default Sprint;
