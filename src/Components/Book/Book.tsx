import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

import MediaQuery from 'react-responsive';

import { useNavigate, useParams } from 'react-router-dom';
import Service, { DataWord } from '../../Service';
import Footer from '../Home/Footer';
import PreLoaderProgress from '../Preloader/PreLoaderProgress';
import BookItem from './BookItem';
import Menu from '../Menu/Menu';
import Header from '../Home/Header';

type DataParams = {
    group: string;
    page: string;
};

const Book = () => {
    const { group, page } = useParams<DataParams>();
    const navigator = useNavigate();
    const [forcePage, setForcePage] = useState<number>(0);
    const [words, setWords] = useState<DataWord[]>([]);
    const [groupInfo, setGroupInfo] = useState<string>('Слова уровня A1');
    const [loader, setLoader] = useState<boolean>(false);
    const [offsetY, setOffsetY] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [levelInfo, setLevelInfo] = useState<string>('Beginner');
    const [textColor, setTextColor] = useState<string>('');
    const [colorLearnedPage, setColorLearnedPage] = useState<string>('');
    const [activePaginationClass, setActivePaginationClass] = useState<string>('');
    const [menuActive, setMenuActive] = useState<boolean>(false);
    let [learn] = useState<string>('');

    useMemo(() => {
        switch (group) {
            case '1':
                setTextColor('red');
                break;
            case '2':
                setTextColor('orange');
                break;
            case '3':
                setTextColor('darkcyan');
                break;
            case '4':
                setTextColor('lightskyblue');
                break;
            case '5':
                setTextColor('lightpink');
                break;
            case '6':
                setTextColor('purple');
                break;
            case '7':
                setTextColor('violet');
                break;
            default:
                break;
        }
    }, [group]);

    const setLocalStorage = () => {
        localStorage.setItem('pageLearn', learn);
    }

    const fetchHardWords = useCallback(
        async (userId: string, token: string) => {
            if (group === '7') {
                setLoader(true);
                const hardWords = (await Service.aggregatedWords(
                    {
                        userId,
                        group: '',
                        page: '',
                        wordsPerPage: '20',
                        filter: `{"$and":[{"userWord.difficulty":"hard", "userWord.optional.testFieldBoolean":${true}}]}`,
                    },
                    token
                )) as DataWord[];
                if (typeof hardWords === 'number') {
                    setIsAuth(false);
                    localStorage.clear();
                    navigator('/authorization');
                    return;
                }
                setWords(hardWords);
                setLoader(false);
            }
        },
        [group, navigator]
    );
    useEffect(() => {
        if (isAuth) {
            const token = localStorage.getItem('token') as string;
            const userId = localStorage.getItem('userId') as string;
            fetchHardWords(userId, token);
        }
    }, [isAuth, fetchHardWords]);

    useEffect(() => {
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        if (token !== null && userId !== null) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
        setForcePage(+(page as string) - 1);
    }, [page]);

    const fetchPartialWords = useCallback(async () => {
        setLoader(true);

        const wordsPartial = (await Service.getWords(+(group as string) - 1, +(page as string) - 1)) as DataWord[];
        setWords(wordsPartial);
        setLoader(false);
    }, [group, page]);

    useEffect(() => {
        fetchPartialWords();
    }, [fetchPartialWords]);

    useEffect(() => {
        switch (group) {
            case '1':
                setGroupInfo('Cлова уровня A1');
                setLevelInfo('Beginner');
                break;
            case '2':
                setGroupInfo('Cлова уровня A2');
                setLevelInfo('Elementary');
                break;
            case '3':
                setGroupInfo('Cлова уровня B1');
                setLevelInfo('Intermediate');
                break;
            case '4':
                setGroupInfo('Слова уровня B2');
                setLevelInfo('Upper Intermediate');
                break;
            case '5':
                setGroupInfo('Слова уровня C1');
                setLevelInfo('Advanced');
                break;
            case '6':
                setGroupInfo('Слова уровня C2');
                setLevelInfo('Proficiency');
                break;
            case '7':
                setGroupInfo('Сложные слова');
                setLevelInfo('');
                break;
            default:
                break;
        }
    }, [group]);

    const showUpButton = useCallback(() => {
        if (offsetY > 1500) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [offsetY]);
    useEffect(() => {
        showUpButton();
    }, [showUpButton]);

    // const pageLerned = () => {
    //     navigator(`/book/${group}/${page}/pageExplored`);
    // }

    const handlerGroup = (event: React.MouseEvent) => {
        const { dataset } = event.target as HTMLDivElement;
        if (!dataset.group) return;
        const currentGroup = dataset.group;
        switch (currentGroup) {
            case '1':
                setGroupInfo('Cлова уровня A1');
                setLevelInfo('Beginner');
                break;
            case '2':
                setGroupInfo('Cлова уровня A2');
                setLevelInfo('Elementary');
                break;
            case '3':
                setGroupInfo('Cлова уровня B1');
                setLevelInfo('Intermediate');
                break;
            case '4':
                setGroupInfo('Слова уровня B2');
                setLevelInfo('Upper Intermediate');
                break;
            case '5':
                setGroupInfo('Слова уровня C1');
                setLevelInfo('Advanced');
                break;
            case '6':
                setGroupInfo('Слова уровня C2');
                setLevelInfo('Proficiency');
                break;
            case '7':
                setGroupInfo('Сложные слова');
                break;
            default:
                break;
        }
        navigator(`/book/${currentGroup}/1`);
    };

    const handlerPageClick = (selectedItem: { selected: number }) => {
        setForcePage(selectedItem.selected);
        navigator(`/book/${group}/${selectedItem.selected + 1}`);
    };
    function scrollCalc() {
        const offsetTop = window.scrollY;
        setOffsetY(offsetTop);
    }
    window.addEventListener('scroll', scrollCalc);

    const setColorPage = useCallback(
        (color: string) => {
            if (color !== '') {
                setColorLearnedPage(color);
                setActivePaginationClass('active learned');
                learn = "true";
                setLocalStorage();
            } else {
                setColorLearnedPage('');
                setActivePaginationClass('active');
                learn = "false";
                setLocalStorage();
            }
        },
        [setColorLearnedPage]
    );

    return (
        <div id="wrapper">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
            <a
                style={{ display: visible ? 'block' : 'none' }}
                href="#top"
                className="btn-floating btn-large waves-effect waves-light red"
            >
                <i className="material-icons">arrow_upward</i>
            </a>
            <div className="group" aria-hidden onClick={handlerGroup}>
                <div className="group-item" data-group="1">
                    Уровень A1 - Beginner
                </div>
                <div className="group-item" data-group="2">
                    Уровень A2 - Elementary
                </div>
                <div className="group-item" data-group="3">
                    Уровень B1 - Intermediate
                </div>
                <div className="group-item" data-group="4">
                    Уровень B2 - Upper Intermediate
                </div>
                <div className="group-item" data-group="5">
                    Уровень C1 - Advanced
                </div>
                <div className="group-item" data-group="6">
                    Уровень C2 - Proficiency
                </div>
                <div style={{ display: isAuth ? 'flex' : 'none' }} className="group-item" data-group="7">
                    &quot;Сложные слова&quot;
                </div>
            </div>
            <div style={{ display: group === '7' || loader ? 'none' : 'flex' }} className="paginate">
                <ReactPaginate
                    onPageChange={handlerPageClick}
                    nextLabel=">"
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={3}
                    forcePage={forcePage}
                    pageCount={30}
                    previousLabel="<"
                    pageClassName="waves-effect"
                    pageLinkClassName="page-link"
                    previousClassName="waves-effect"
                    previousLinkClassName="page-link"
                    nextClassName="waves-effect"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="waves-effect"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName={activePaginationClass}
                />
            </div>
            <PreLoaderProgress show={loader} />
            <div id="container" style={{ display: !loader ? 'block' : 'none' }}>
                <div className="wrapper-flag" onClick={handlerGroup} aria-hidden>
                    <div className="flag" data-group="1">
                        <span className="flag-text">Уровень A1</span>
                    </div>
                    <div className="flag" data-group="2">
                        {' '}
                        <span className="flag-text">Уровень A2</span>
                    </div>
                    <div className="flag" data-group="3">
                        {' '}
                        <span className="flag-text">Уровень B1</span>
                    </div>
                    <div className="flag" data-group="4">
                        {' '}
                        <span className="flag-text">Уровень B2</span>{' '}
                    </div>
                    <div className="flag" data-group="5">
                        {' '}
                        <span className="flag-text">Уровень C1</span>{' '}
                    </div>
                    <div className="flag" data-group="6">
                        {' '}
                        <span className="flag-text">Уровень C2</span>
                    </div>
                    <div style={{ display: isAuth ? 'block' : 'none' }} className="flag" data-group="7">
                        {' '}
                        <span className="flag-text">Сложные</span>
                    </div>
                </div>
                <section className="open-book">
                    <h2 style={{ color: textColor }} className="chapter-title">
                        {words.length ? groupInfo : 'Здесь пока ничего нет...'}
                    </h2>
                    <MediaQuery minWidth={800}>
                        <h2
                            style={{ display: group !== '7' ? 'inline-block' : 'none', color: colorLearnedPage }}
                            className="chapter-title "
                        >
                            {words.length ? levelInfo : ''}
                        </h2>
                    </MediaQuery>
                    <article>
                        {words.map((word) => (
                            <BookItem
                                key={word.id || word._id}
                                id={word.id || (word._id as string)}
                                word={word.word}
                                image={word.image}
                                audio={word.audio}
                                audioMeaning={word.audioMeaning}
                                audioExample={word.audioExample}
                                textMeaning={word.textMeaning}
                                textExample={word.textExample}
                                transcription={word.transcription}
                                wordTranslate={word.wordTranslate}
                                textMeaningTranslate={word.textMeaningTranslate}
                                textExampleTranslate={word.textExampleTranslate}
                                group={group as string}
                                page={page as string}
                                callback={setColorPage}
                            />
                        ))}
                    </article>
                </section>
            </div>

            {!loader && <Footer />}
        </div>
    );
};

export default Book;
