import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AudioGame.css';
import Header from '../../Home/Header';
import Service, { DataAggregatedWordsById, DataStat, DataWord } from '../../../Service';
import Menu from '../../Menu/Menu';
import shuffle from '../../../Utils/shuffleArray';
import getRandomNumber from '../../../Utils/random';

let answersInRow = 0;
const AudioGame = () => {
    const navigator = useNavigate();
    const { group, page } = useParams();
    const [words, setWords] = useState<DataWord[]>([]);
    const [showMain, setShowMain] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [wordsToGuess, setWordsToGuess] = useState<DataWord[]>([]);
    const [guessedWordsIDs, setGuessedWordsIDs] = useState<string[]>([]);
    const [notGuessedWordsIDs, setNotGuessedWordsIDs] = useState<string[]>([]);
    const [guessedWords, setGuessedWords] = useState<DataWord[]>([]);
    const [notGuessedWords, setNotGuessedWords] = useState<DataWord[]>([]);
    const [correctWord, setCorrectWord] = useState<DataWord>();
    const [correctWordId, setCorrectWordId] = useState<string>('');
    const [correctText, setCorrectText] = useState<string>('');
    const [wordIndex, setWordIndex] = useState<number>(0);
    const [wordLength, setWordLength] = useState<number>(-1);
    const [imgSrc, setImgSrc] = useState<string>('');
    const [btnNum, setBtnNum] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isAnswered, setIsAnswered] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean[]>(Array.from({ length: 5 }, () => false));
    const [isDisabledStart, setIsDisabledStart] = useState<boolean>(true);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true);
    const [groupText, setGroupText] = useState<string>('');
    const [className, setClassName] = useState<string>('answer');
    const [menuActive, setMenuActive] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [classResult, setClassResult] = useState<string>('');
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
                    wordsPerPage: '',
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
            // if (learnedWordsFiltered.length === 20) {
            //     navigator('/pageExplored');
            // }

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

    const generateWordsToGuess = useCallback(async () => {
        let num: number = 0;
        const arr: DataWord[] = [];
        const generated: number[] = [];
        const player = new Audio(`https://learn-english-words-app.herokuapp.com/${words[wordIndex].audio}`);
        setAudioUrl(`https://learn-english-words-app.herokuapp.com/${words[wordIndex].audio}`);
        player.play();
        setClassName('');
        setIsNextDisabled(true);
        setIsDisabled(Array.from({ length: 5 }, () => false));
        setBtnNum('');
        setIsAnswered(false);
        setShowAnswer(true);
        setShowMain(false);
        setCorrectWord(words[wordIndex]);
        setCorrectWordId(words[wordIndex].id);
        setCorrectText('');
        setImgSrc('');

        arr.push(words[wordIndex]);

        for (let index = 0; index < 4; index += 1) {
            do {
                num = getRandomNumber(words.length);
            } while (generated.includes(num) || num === wordIndex);
            generated.push(num);
            arr.push(words[num]);
        }
        const shuffledWordsToGuess = shuffle(arr);
        setWordsToGuess(shuffledWordsToGuess);
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
                let { wordsInRowAudioGame } = optional;

                if (answersInRow > wordsInRowAudioGame) {
                    wordsInRowAudioGame = answersInRow;
                }

                const totalCorrectAnswersAudioGame = optional.totalCorrectAnswersAudioGame + 1;
                const totalQuestionsAudioGame = optional.totalQuestionsAudioGame + 1;

                optional = {
                    ...optional,
                    wordsInRowAudioGame,
                    totalCorrectAnswersAudioGame,
                    totalQuestionsAudioGame,
                };
                let dataStatUpdate = { ...responseStat, optional };
                setTimeout(async () => {
                    await Service.updateUserStat(dataStatUpdate, userId, token);
                }, 100);

                /*                 let { optional } = dataStat;
                const totalQuestionsAudioGame = dataStat.optional.totalQuestionsAudioGame + 1;
                let { wordsInRowAudioGame } = dataStat.optional;

                if (answersInRow > wordsInRowAudioGame) {
                    wordsInRowAudioGame = answersInRow;
                }
                const totalCorrectAnswersAudioGame = dataStat.optional.totalCorrectAnswersAudioGame + 1;

                optional = { ...optional, totalCorrectAnswersAudioGame, wordsInRowAudioGame, totalQuestionsAudioGame };
                let dataStatUpdate = { ...dataStat, optional };
                setDataStat(dataStatUpdate); */

                if (!word[0]?.userWord) {
                    await Service.createUserWord({ userId, wordId }, token, {
                        difficulty: 'answered',
                        optional: { guessedCount: '1', inGame: true, testFieldBoolean: true },
                    });
                    const newWordsAudioGame = optional.newWordsAudioGame + 1;
                    optional = { ...optional, newWordsAudioGame };
                    dataStatUpdate = { ...responseStat, optional };
                    setTimeout(async () => {
                        await Service.updateUserStat(dataStatUpdate, userId, token);
                    }, 100);
                    /*          const newWordsAudioGame = dataStat.optional.newWordsAudioGame + 1;
                    optional = { ...optional, newWordsAudioGame };
                    dataStatUpdate = { ...dataStat, optional };
                    setDataStat(dataStatUpdate); */
                } else {
                    let guessedCount: number = +word[0].userWord.optional.guessedCount || 0;
                    const notGuessedCount: number = +word[0].userWord.optional.notGuessedCount || 0;
                    guessedCount += 1;
                    if (word[0].userWord.difficulty === 'hard' && guessedCount >= 5 && notGuessedCount <= 1) {
                        const optionalUserWord = word[0]?.userWord.optional;
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
                        /*                const learnedWordsUpdate = dataStat.learnedWords + 1;
                        dataStatUpdate = { ...dataStat, learnedWords: learnedWordsUpdate };
                        setDataStat(dataStatUpdate); */
                    } else if (
                        word[0].userWord.difficulty === 'answered' &&
                        guessedCount >= 3 &&
                        notGuessedCount <= 1
                    ) {
                        const optionalUserWord = word[0]?.userWord.optional;
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
                        /*        const learnedWordsUpdate = dataStat.learnedWords + 1;
                        dataStatUpdate = { ...dataStat, learnedWords: learnedWordsUpdate };
                        setDataStat(dataStatUpdate); */
                    } else {
                        const optionalUserWord = word[0]?.userWord.optional;
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
                /*                let { optional } = dataStat;
                const wordsInRowAudioGame = 0;
                optional = { ...optional, wordsInRowAudioGame };
                let dataStatUpdate = { ...dataStat, optional };
                setDataStat(dataStatUpdate); */
                let responseStat = (await Service.getUserStat(userId, token)) as DataStat;
                delete responseStat.id;
                let { optional } = responseStat;
                const { learnedWords } = responseStat;
                const wordsInRowAudioGame = 0;
                const totalQuestionsAudioGame = optional.totalQuestionsAudioGame + 1;

                optional = {
                    ...optional,
                    wordsInRowAudioGame,
                    totalQuestionsAudioGame,
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

                    /*       const newWordsAudioGame = dataStat.optional.newWordsAudioGame + 1;
                    optional = { ...optional, newWordsAudioGame };
                    dataStatUpdate = { ...dataStat, optional };
                    setDataStat(dataStatUpdate); */
                    const newWordsAudioGame = optional.newWordsAudioGame + 1;
                    optional = { ...optional, newWordsAudioGame };
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
                        /*      const learnedWordsUpdate = dataStat.learnedWords - 1;
                        dataStatUpdate = { ...dataStat, learnedWords: learnedWordsUpdate }; */
                    }
                    let notGuessedCount: number = +word[0].userWord.optional.notGuessedCount || 0;
                    const optionalWord = word[0].userWord.optional;
                    notGuessedCount += 1;
                    await Service.updateUserWord({ userId, wordId }, token, {
                        difficulty: 'answered',
                        optional: { ...optionalWord, notGuessedCount: `${notGuessedCount}` },
                    });
                }
            }
        },
        [isAuth, navigator]
    );

    const checkAnswer = useCallback(
        (event?: React.MouseEvent, key?: string) => {
            let currentBtnNum: string = '';
            let variantWordId: string = '';
            const disabledArr = Array.from({ length: 5 }, () => false);
            const target = event?.target as HTMLDivElement;

            if (target) {
                const { dataset } = target;
                if (!dataset.answer) return;
                variantWordId = dataset.answer;
                currentBtnNum = dataset.num as string;
            } else if (key) {
                variantWordId = wordsToGuess[+key].id;
                currentBtnNum = key;
            }
            setBtnNum(currentBtnNum);
            disabledArr.forEach((_, i) => {
                if (i !== +(currentBtnNum as string)) {
                    disabledArr[i] = true;
                }
            });

            setIsDisabled(disabledArr);
            setImgSrc(`https://learn-english-words-app.herokuapp.com/${correctWord?.image}`);
            if (variantWordId === correctWordId) {
                if (guessedWordsIDs.includes(variantWordId)) {
                    return;
                }

                setGuessedWordsIDs([...guessedWordsIDs, variantWordId]);
                const word = words.find((w) => w.id === variantWordId) as DataWord;
                setGuessedWords([...guessedWords, word]);
                setMessage('Верно!');
                setClassName('correct');
                if (isAuth) {
                    answersInRow += 1;
                }
                createCorrectWord(variantWordId);
            } else {
                answersInRow = 0;
                setCorrectText(correctWord?.wordTranslate as string);
                setNotGuessedWordsIDs([...notGuessedWordsIDs, correctWordId]);
                const word = words.find((w) => w.id === correctWordId) as DataWord;
                setNotGuessedWords([...notGuessedWords, word]);
                setMessage('Ошибка');
                setClassName('incorrect');
                createIncorrectWord(correctWordId);
            }
            setIsAnswered(true);
            setIsNextDisabled(false);
            setWordIndex(wordIndex + 1);
        },
        [
            correctWord?.image,
            correctWord?.wordTranslate,
            correctWordId,
            createCorrectWord,
            createIncorrectWord,
            guessedWordsIDs,
            notGuessedWordsIDs,
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

            if (!group && !page) {
                setCurrentPage(currentPage + 1);
            }
            setClassResult('visible');
        }
    }, [wordIndex, wordLength, group, page, currentPage]);

    useEffect(() => {
        if (currentPage === 30) {
            setCurrentPage(0);
            setCurrentGroup(currentGroup + 1);
            if (currentGroup === 6) {
                setCurrentGroup(0);
            }
        }
    }, [currentPage, currentGroup]);

    const audioHandler = (event: React.MouseEvent) => {
        const { audio } = (event.target as HTMLElement).dataset;
        const player = new Audio(`https://learn-english-words-app.herokuapp.com/${audio}`);

        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    };

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
            if ((event.code === 'Enter' || event.code === 'Space') && isAnswered) {
                generateWordsToGuess();
            } else if (showMain && event.code === 'Enter') {
                generateWordsToGuess();
            } else if (event.code === 'Escape' && showAnswer) {
                setClassResult('visible');
                setClassName('');
            } else if (showMain && +event.key >= 1 && +event.key <= 6) {
                setCurrentGroup(+event.key);
                setIsDisabledStart(false);
            } else if (showAnswer && +event.key >= 1 && +event.key <= 5 && !isAnswered) {
                checkAnswer(undefined, `${+event.key - 1}`);
            }
        };
        document.addEventListener('keydown', keyBoardHandler);

        return () => {
            document.removeEventListener('keydown', keyBoardHandler);
        };
    }, [showMain, showAnswer, isAnswered, checkAnswer, generateWordsToGuess]);

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
        <div className="game-page ">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
            <div className="game">
                <div className="game-audio">
                    <div className="game-content audio-game">
                        {showMain && (
                            <div className="sign">
                                <span className="sign__word">Игра Аудиовызов</span>
                                <h2 style={{ display: group ? 'none' : 'block' }}>Выберите уровень сложности</h2>
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
                                <span className="group-text"> {groupText} </span>
                            </div>
                        )}
                        <button
                            className="btn-start"
                            disabled={group && page ? false : isDisabledStart}
                            style={{ display: showMain ? 'block' : 'none' }}
                            aria-hidden
                            onClick={generateWordsToGuess}
                            type="button"
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
                                                setNotGuessedWordsIDs([]);
                                                setGuessedWordsIDs([]);
                                                setIsDisabledStart(true);
                                                setGroupText('');
                                                answersInRow = 0;
                                            }}
                                        >
                                            close
                                        </i>
                                        <i
                                            title="Продолжить"
                                            style={{ cursor: 'pointer', color: '#ddd' }}
                                            aria-hidden
                                            className="material-icons  medium"
                                            onClick={() => {
                                                setClassResult('');
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
                                                            textAlign: 'center',
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
                                                                {word.word}
                                                                <i
                                                                    data-audio={word.audio}
                                                                    aria-hidden
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        color: 'green',
                                                                    }}
                                                                    className="material-icon"
                                                                    onClick={audioHandler}
                                                                >
                                                                    audiotrack
                                                                </i>
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
                                                            textAlign: 'center',
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
                                                                {word.word}
                                                                <i
                                                                    data-audio={word.audio}
                                                                    aria-hidden
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        color: 'red',
                                                                    }}
                                                                    className="material-icon"
                                                                    onClick={audioHandler}
                                                                >
                                                                    audiotrack
                                                                </i>
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

                                <div className="audio-question">
                                    {showAnswer && <img src={imgSrc} className="right-image" alt="" />}
                                    {showAnswer && <div className="right-answer">{correctText}</div>}
                                    <i
                                        aria-hidden
                                        style={{ cursor: 'pointer', color: '#485784' }}
                                        className={`material-icon medium `}
                                        onClick={() => {
                                            const player = new Audio(audioUrl);
                                            player.play();
                                        }}
                                    >
                                        audiotrack
                                    </i>{' '}
                                </div>

                                <div className="answers" aria-hidden onClick={checkAnswer}>
                                    {wordsToGuess.map((word, i) => (
                                        <button
                                            data-num={i}
                                            key={word.id}
                                            data-answer={word.id}
                                            className={isAnswered && i === +btnNum ? `answer ${className}` : 'answer'}
                                            disabled={isDisabled[i]}
                                            aria-hidden
                                            type="button"
                                            style={{ font: 'bold 14px Verdana, cursive' }}
                                        >
                                            {btnNum && i === +btnNum ? message : `(${i + 1})  ${word.wordTranslate}`}
                                        </button>
                                    ))}
                                </div>

                                {showAnswer && (
                                    <button
                                        disabled={isNextDisabled}
                                        className="btn-next"
                                        aria-hidden
                                        onClick={generateWordsToGuess}
                                        type="button"
                                    >
                                        Следующее слово (Пробел)
                                    </button>
                                )}

                                <div
                                    className="btn-end"
                                    aria-hidden
                                    onClick={() => {
                                        setClassResult('visible');
                                        setClassName('');
                                    }}
                                >
                                    Закончить игру (Esc)
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioGame;
