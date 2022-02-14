import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Service, { DataAggregatedWordsById } from '../../Service';
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
    callback: (color: string) => void;
};
let totalLearnedWords = 0;
const DictionaryItem = ({ ...props }: DictionaryItemProps) => {
    const { id: wordId, group, callback } = props;
    const navigator = useNavigate();
    const pRefExample = useRef<HTMLParagraphElement>(null);
    const pRefMeaning = useRef<HTMLParagraphElement>(null);
    const checkBoxHard = useRef<HTMLInputElement>(null);
    const checkBoxLearned = useRef<HTMLInputElement>(null);
    const [colorText, setColorText] = useState<string>('');
    const [textLearned, setTextLearned] = useState<string>('Добавить в изученные');
    const [textHard, setTextHard] = useState<string>('Добавить в сложные');
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [color, setColor] = useState<string>('');
    const [isLearned, setIsLearned] = useState<boolean>(false);
    const player = new Audio('');
    const imageUrl = `https://learn-english-words-app.herokuapp.com/${props.image}`;
    const audioMeaningUrl = `https://learn-english-words-app.herokuapp.com/${props.audioMeaning}`;
    const audioExampleUrl = `https://learn-english-words-app.herokuapp.com/${props.audioExample}`;
    const audioUrl = `https://learn-english-words-app.herokuapp.com/${props.audio}`;

    useMemo(() => {
        switch (group) {
            case '1':
            case '2':
                setColor('purple');
                break;
            case '3':
            case '4':
                setColor('orange');
                break;
            case '5':
            case '6':
                setColor('blue');
                break;
            default:
                break;
        }
    }, [group]);
    const handlerAudioMeaning = () => {
        player.src = audioMeaningUrl;
        if (player.paused) {
            player.play();
            return;
        }
        player.pause();
    };

    const fetchHardWords = useCallback(async () => {
        if (isAuth) {
            const token = localStorage.getItem('token') as string;
            const userId = localStorage.getItem('userId') as string;
            const word = (await Service.aggregatedWordsById({ userId, wordId }, token)) as DataAggregatedWordsById[];
            if (word[0]?.userWord?.difficulty === 'hard' && checkBoxHard.current !== null) {
                (checkBoxHard.current as HTMLInputElement).checked = true;
                setTextHard('Убрать из сложных');
                setColorText('blue');
            }
            if (word[0]?.userWord?.difficulty === 'learned' && checkBoxLearned.current !== null) {
                (checkBoxLearned.current as HTMLInputElement).checked = true;
                setTextLearned('Изучено');
                setColorText('green');
                setIsLearned(true);
                if (totalLearnedWords === 20) {
                    totalLearnedWords = 0;
                }
                totalLearnedWords += 1;
            }
        }
    }, [wordId, isAuth]);

    useEffect(() => {
        fetchHardWords();
    }, [fetchHardWords]);

    useEffect(() => {
        if (isLearned) {
            if (totalLearnedWords === 20) {
                callback('green');
            }
        } else {
            callback('');
        }
    }, [isLearned, callback]);

    const handlerAudioExample = () => {
        player.src = audioExampleUrl;
        if (player.paused) {
            player.play();
            return;
        }
        player.pause();
    };

    const handlerAudio = () => {
        player.src = audioUrl;
        if (player.paused) {
            player.play();
            return;
        }
        player.pause();
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
        if (checked) {
            setColorText('green');
            setTextLearned('Изучено');
            totalLearnedWords += 1;
            setIsLearned(true);

            const data = await Service.createUserWord({ userId, wordId }, token, {
                difficulty: 'learned',
                optional: { testFieldString: 'test', testFieldBoolean: true },
            });
            if (typeof data === 'number') {
                setIsAuth(false);
                localStorage.clear();
                navigator('/authorization');
            }
        } else {
            setColorText('');
            setTextLearned('Добавить в изученные');
            totalLearnedWords -= 1;
            setIsLearned(false);

            const data = await Service.deleteUserWord({ userId, wordId }, token);
            if (data === 401) {
                setIsAuth(false);
                localStorage.clear();
                navigator('/authorization');
            }
        }
    };

    const addWordToHard = async (event: React.ChangeEvent) => {
        const { checked } = event.target as HTMLInputElement;
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        if (checked) {
            setColorText('blue');
            setTextHard('Убрать из сложных');

            const data = await Service.createUserWord({ userId, wordId }, token, {
                difficulty: 'hard',
                optional: { testFieldString: 'test', testFieldBoolean: true },
            });
            if (typeof data === 'number') {
                setIsAuth(false);
                localStorage.clear();
                navigator('/authorization');
            }
        } else {
            setColorText('');
            setTextHard('Отметить как сложное');
            const data = await Service.deleteUserWord({ userId, wordId }, token);
            if (data === 401) {
                setIsAuth(false);
                localStorage.clear();
                navigator('/authorization');
            }
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
    return (
        <div className="col s12">
            <h2 style={{ color: colorText }} className="header header-card">
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
                </div>
                <div className="card-stacked">
                    <div className="card-content">
                        <p className="info" ref={pRefMeaning} />
                        <p className="info">{props.textMeaningTranslate}</p>
                        <i
                            aria-hidden
                            onClick={handlerAudioMeaning}
                            style={{ cursor: 'pointer' }}
                            className={`material-icons prefix ${color}`}
                        >
                            audiotrack
                        </i>
                        <div className="card-action" />
                        <p className="info" ref={pRefExample} />
                        <p className="info">{props.textExampleTranslate}</p>
                        <i
                            aria-hidden
                            onClick={handlerAudioExample}
                            style={{ cursor: 'pointer' }}
                            className={`material-icons prefix ${color}`}
                        >
                            audiotrack
                        </i>
                        <div className="card-action">
                            <div className="card-action_inner">
                                <label style={{ display: isAuth && group !== '7' ? 'block' : 'none' }}>
                                    <input ref={checkBoxLearned} type="checkbox" onChange={addWordToLearned} />
                                    <span>{textLearned}</span>
                                </label>
                                <label style={{ display: isAuth && group !== '7' ? 'block' : 'none' }}>
                                    <input ref={checkBoxHard} type="checkbox" onChange={addWordToHard} />
                                    <span>{textHard}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DictionaryItem;