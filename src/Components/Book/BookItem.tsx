/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Service, { DataAggregatedWordsById, DataStat } from '../../Service';
import './Book.css';

type DictionaryItemProps = {
    id: string;
    word: string;
    image: string;
    audio: string;
    audioMeaning: string;
    audioExample: string;
    textMeaning: string;
    textExample: string;
    transcription: string;
    wordTranslate: string;
    textMeaningTranslate: string;
    textExampleTranslate: string;
    group: string;
    page: string;
    callbackTotalLearned: (count: number) => void;
    callbackDeleteHard: (wordId: string) => void;
    totalLearned: number;
};

const player = new Audio('');

const DictionaryItem = ({ ...props }: DictionaryItemProps) => {
    const { id: wordId, group, callbackTotalLearned, callbackDeleteHard, totalLearned } = props;

    const [count, setCount] = useState<number>(totalLearned);
    const pRefExample = useRef<HTMLParagraphElement>(null);
    const pRefMeaning = useRef<HTMLParagraphElement>(null);
    const checkBoxHard = useRef<HTMLInputElement>(null);
    const checkBoxLearned = useRef<HTMLInputElement>(null);
    const [colorText, setColorText] = useState<string>('');
    const [textLearned, setTextLearned] = useState<string>('Добавить в изученные');
    const [textHard, setTextHard] = useState<string>('Добавить в сложные');
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [totalCorrect, setTotalCorrect] = useState<number>(0);
    const [totalInCorrect, setTotalInCorrect] = useState<number>(0);
    const [isShowStat, setIsShowStat] = useState<boolean>(false);
    const [disabledLearned, setDisabledLearned] = useState<boolean>(false);
    const [disabledHard, setDisabledHard] = useState<boolean>(false);
    const imageUrl = `https://learn-english-words-app.herokuapp.com/${props.image}`;
    const audioMeaningUrl = `https://learn-english-words-app.herokuapp.com/${props.audioMeaning}`;
    const audioExampleUrl = `https://learn-english-words-app.herokuapp.com/${props.audioExample}`;
    const audioUrl = `https://learn-english-words-app.herokuapp.com/${props.audio}`;

    const setWordParams = useCallback(async () => {
        if (isAuth) {
            const token = localStorage.getItem('token') as string;
            const userId = localStorage.getItem('userId') as string;
            const word = (await Service.aggregatedWordsById({ userId, wordId }, token)) as DataAggregatedWordsById[];

            if (word[0]?.userWord?.difficulty === 'hard' && checkBoxHard.current !== null) {
                (checkBoxHard.current as HTMLInputElement).checked = true;
                (checkBoxLearned.current as HTMLInputElement).disabled = true;
                setTextHard('Убрать из сложных');
                setColorText('#EB4C42');
            }
            if (word[0]?.userWord?.difficulty === 'learned' && checkBoxLearned.current !== null) {
                (checkBoxLearned.current as HTMLInputElement).checked = true;
                (checkBoxHard.current as HTMLInputElement).disabled = true;
                setTextLearned('Изучено');
                setColorText('#50C878');
            }

            if (word[0]?.userWord?.optional.inGame) {
                setIsShowStat(true);
                if (word[0]?.userWord?.optional?.guessedCount) {
                    setTotalCorrect(+word[0].userWord.optional.guessedCount);
                }
                if (word[0]?.userWord?.optional?.notGuessedCount) {
                    setTotalInCorrect(+word[0].userWord.optional.notGuessedCount);
                }
            }
        }
    }, [wordId, isAuth]);

    useEffect(() => {
        setWordParams();
    }, [setWordParams]);

    useEffect(() => {
        callbackTotalLearned(count);
    }, [count, callbackTotalLearned]);

    const handlerAudio = () => {
        let track: number = 0;
        player.src = audioUrl;
        player.addEventListener('ended', () => {
            switch (track) {
                case 1:
                    player.src = audioMeaningUrl;
                    player.play();
                    track += 1;
                    break;
                case 2:
                    player.src = audioExampleUrl;
                    player.play();
                    track = 0;
                    break;
                default:
                    break;
            }
        });
        if (player.paused) {
            player.play();
            track += 1;
        } else {
            player.pause();
        }
    };

    useEffect(() => {
        if (pRefExample.current !== null) {
            (pRefExample.current as HTMLParagraphElement).innerHTML = props.textExample;
        }
        if (pRefMeaning.current !== null) {
            (pRefMeaning.current as HTMLParagraphElement).innerHTML = props.textMeaning;
        }
    }, [props.textExample, props.textMeaning]);

    const addWordToLearned = async (event: React.ChangeEvent) => {
        const { checked } = event.target as HTMLInputElement;
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        const responseStat = (await Service.getUserStat(userId, token)) as DataStat;
        const { learnedWords, optional } = responseStat;
        let currentTotal: number = totalLearned;
        if (checked) {
            setColorText('#50C878');
            setTextLearned('Изучено');
            setDisabledHard(true);
            currentTotal += 1;

            setCount(currentTotal);

            await Service.createUserWord({ userId, wordId }, token, {
                difficulty: 'learned',
                optional: { guessedCount: '0', testFieldBoolean: true },
            });

            const learnedWordsUpdate = learnedWords + 1;

            setTimeout(async () => {
                await Service.updateUserStat(
                    {
                        learnedWords: learnedWordsUpdate,
                        optional: { ...optional },
                    },
                    userId,
                    token
                );
            }, 100);
        } else {
            setColorText('');
            setTextLearned('Добавить в изученные');
            setDisabledHard(false);
            currentTotal -= 1;
            setCount(currentTotal);
            await Service.deleteUserWord({ userId, wordId }, token);
            const learnedWordsUpdate = learnedWords - 1;
            setTimeout(async () => {
                await Service.updateUserStat(
                    {
                        learnedWords: learnedWordsUpdate,
                        optional: { ...optional },
                    },
                    userId,
                    token
                );
            }, 100);
        }
    };

    const addWordToHard = async (event: React.ChangeEvent) => {
        const { checked } = event.target as HTMLInputElement;
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        if (checked) {
            setColorText('#EB4C42');
            setTextHard('Убрать из сложных');
            setDisabledLearned(true);
            await Service.createUserWord({ userId, wordId }, token, {
                difficulty: 'hard',
                optional: { guessedCount: '0', testFieldBoolean: true },
            });
        } else {
            setColorText('');
            setTextHard('Отметить как сложное');
            setDisabledLearned(false);
            await Service.deleteUserWord({ userId, wordId }, token);
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        if (token !== null && userId !== null) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

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
            }
        }
    }, [isAuth]);

    useEffect(() => {
        initStatistic();
    }, [initStatistic]);

    const deleteFromHard = (event: React.MouseEvent) => {
        const { id } = event.target as HTMLElement;
        callbackDeleteHard(id as string);
    };

    return (
        <div className="col s12">
            <div className="border">
                <div className="border-top" />
                <div className="center">
                    <h2 style={{ backgroundColor: colorText }} className="header header-card">
                        {props.word} - {props.transcription} - {props.wordTranslate}{' '}
                        <i
                            aria-hidden
                            onClick={handlerAudio}
                            style={{ cursor: 'pointer' }}
                            className="material-icons small prefix"
                        >
                            audiotrack
                        </i>{' '}
                    </h2>

                    <div className="card horizontal">
                        <div className="card-image">
                            <img src={imageUrl} alt="img" />
                            <div className="card-action">
                                <div className="card-action_inner">
                                    <div className="checkbox-first">
                                        {group === '7' && (
                                            <i
                                                style={{ cursor: 'pointer' }}
                                                title="Удалить"
                                                aria-hidden
                                                id={props.id}
                                                className="material-icons"
                                                onClick={deleteFromHard}
                                            >
                                                delete
                                            </i>
                                        )}
                                        <label
                                            className="checkbox-first__label"
                                            style={{ display: isAuth && group !== '7' ? 'block' : 'none' }}
                                        >
                                            <input
                                                ref={checkBoxLearned}
                                                type="checkbox"
                                                onChange={addWordToLearned}
                                                className="checkbox-first__input"
                                                disabled={disabledLearned}
                                            />
                                            <div className="checkbox">
                                                <svg width="20px" height="20px" viewBox="0 0 20 20">
                                                    <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z" />
                                                    <polyline points="4 11 8 15 16 6" />
                                                </svg>
                                            </div>
                                            <span>{textLearned}</span>
                                        </label>
                                    </div>
                                    <div className="checkbox-first">
                                        <label
                                            className="checkbox-first__label"
                                            style={{ display: isAuth && group !== '7' ? 'block' : 'none' }}
                                        >
                                            <input
                                                ref={checkBoxHard}
                                                onChange={addWordToHard}
                                                type="checkbox"
                                                className="checkbox-first__input"
                                                disabled={disabledHard}
                                            />
                                            <div className="checkbox">
                                                <svg width="20px" height="20px" viewBox="0 0 20 20">
                                                    <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z" />
                                                    <polyline points="4 11 8 15 16 6" />
                                                </svg>
                                            </div>
                                            <span>{textHard}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-stacked">
                            <div className="card-content">
                                <p className="info" ref={pRefMeaning} />
                                <p className="info">{props.textMeaningTranslate}</p>
                                <div className="card-action" />
                                <p className="info" ref={pRefExample} />
                                <p className="info">{props.textExampleTranslate}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: isAuth && isShowStat ? 'block' : 'none' }} className="stat-info">
                        <p className="card-rez">Статистика слова:</p>
                        <p className="card-rez">Правильных ответов в играх: {totalCorrect}</p>
                        <p className="card-rez">Ошибочных ответов в играх: {totalInCorrect}</p>
                    </div>
                </div>
                <div className="border-bottom" />
            </div>
        </div>
    );
};

export default DictionaryItem;
