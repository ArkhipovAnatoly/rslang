import { useState, useCallback, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import './Statistics.css';
import Menu from '../Menu/Menu';
import Service, { DataStat } from '../../Service';

// const data = [
//     {
//         name: 'День 1',
//         new: 20,
//         learned: 20,
//     },
//     {
//         name: 'День 2',
//         new: 21,
//         learned: 15,
//     },
//     {
//         name: 'День 3',
//         new: 25,
//         learned: 25,
//     },
//     {
//         name: 'День 4',
//         new: 32,
//         learned: 25,
//     },
//     {
//         name: 'День 5',
//         new: 18,
//         learned: 13,
//     },
//     {
//         name: 'День 6',
//         new: 19,
//         learned: 14,
//     },
//     {
//         name: 'День 7',
//         new: 20,
//         learned: 15,
//     },
// ];

const Statistics = () => {
    const [menuActive, setMenuActive] = useState<boolean>(false);
    const [stateData, setStateData] = useState<DataStat>({
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
    });
    const [audioGamePercent, setAudioGamePercent] = useState<number>(0);
    const [sprintGamePercent, setSprintGamePercent] = useState<number>(0);
    const [totalPercent, setTotalPercent] = useState<number>(0);

    const dayResults = useCallback(async () => {
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        const responseStat = await Service.getUserStat(userId, token);
        if (responseStat !== 404) {
            setStateData(responseStat as DataStat);
        }
    }, []);

    useEffect(() => {
        dayResults();
    }, [dayResults]);

    useEffect(() => {
        if (stateData!.optional.totalQuestionsAudioGame !== 0) {
            const audioAnswers = (
                (stateData!.optional.totalCorrectAnswersAudioGame / stateData!.optional.totalQuestionsAudioGame) *
                100
            ).toFixed(1);
            setAudioGamePercent(+audioAnswers);
        } else {
            setAudioGamePercent(0);
        }
        if (stateData!.optional.totalQuestionsSprintGame !== 0) {
            const sprintAnswers = (
                (stateData!.optional.totalCorrectAnswersSprintGame / stateData!.optional.totalQuestionsSprintGame) *
                100
            ).toFixed(1);
            setSprintGamePercent(+sprintAnswers);
        } else {
            setSprintGamePercent(0);
        }
        if (stateData!.optional.totalQuestionsSprintGame !== 0 && stateData!.optional.totalQuestionsAudioGame !== 0) {
            const totalAnswers = (
                ((stateData!.optional.totalCorrectAnswersSprintGame +
                    stateData!.optional.totalCorrectAnswersAudioGame) /
                    (stateData!.optional.totalQuestionsSprintGame + stateData!.optional.totalQuestionsAudioGame)) *
                100
            ).toFixed(1);
            setTotalPercent(+totalAnswers);
        } else {
            setTotalPercent(0);
        }
    }, [stateData]);
    return (
        <div className="statistics_wrapper">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
            <h2>Статистика</h2>
            <h4>Успехи сегодня</h4>
            <div className="stat-day">
                <div className="stat-words">
                    <h5>По словам</h5>
                    <div className="stat-words_result">
                        <div className="stat-words_count">
                            <p>Новых слов</p>
                            <p>
                                {stateData!.optional.newWordsAudioGame + stateData!.optional.newWordsSprintGame}
                                шт
                            </p>
                        </div>
                        <div className="stat-words_count">
                            <p>Изученных слов</p>
                            <p>{stateData?.learnedWords} шт</p>
                        </div>
                        <div className="stat-words_count">
                            <p>Правильных ответов</p>
                            <p>{totalPercent} %</p>
                        </div>
                    </div>
                </div>
                <div className="stat-games">
                    <h5>Аудиовызов</h5>
                    <div className="stat-games_result">
                        <div className="stat-games_count">
                            <p>Новых слов</p>
                            <p>{stateData?.optional.newWordsAudioGame} шт</p>
                        </div>
                        <div className="stat-games_count">
                            <p>Правильных ответов</p>
                            <p>{audioGamePercent}%</p>
                        </div>
                        <div className="stat-games_count">
                            <p>Самая длинная серия правильных ответов</p>
                            <p>
                                {stateData.optional.wordsInRowAudioGame}
                                шт
                            </p>
                        </div>
                    </div>
                </div>
                <div className="stat-games">
                    <h5>Спринт</h5>
                    <div className="stat-games_result">
                        <div className="stat-games_count">
                            <p>Новых слов</p>
                            <p>
                                {stateData.optional.newWordsSprintGame}
                                шт
                            </p>
                        </div>
                        <div className="stat-games_count">
                            <p>Правильных ответов</p>
                            <p> {sprintGamePercent}%</p>
                        </div>
                        <div className="stat-games_count">
                            <p>Самая длинная серия правильных ответов</p>
                            <p>{stateData?.optional.wordsInRowSprintGame} шт</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* <h4>Долгосрочная статистика</h4>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="new" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="learned" stroke="#82ca9d" />
            </LineChart> */}
            <Footer />
        </div>
    );
};
export default Statistics;
