import { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import './Statistics.css';
import Menu from '../Menu/Menu';
import Service from '../../Service';

const data = [
    {
        name: 'День 1',
        new: 20,
        learned: 20,
    },
    {
        name: 'День 2',
        new: 21,
        learned: 15,
    },
    {
        name: 'День 3',
        new: 25,
        learned: 25,
    },
    {
        name: 'День 4',
        new: 32,
        learned: 25,
    },
    {
        name: 'День 5',
        new: 18,
        learned: 13,
    },
    {
        name: 'День 6',
        new: 19,
        learned: 14,
    },
    {
        name: 'День 7',
        new: 20,
        learned: 15,
    },
];

type DataStat = {
    learnedWords: number;
    optional: {
        newWordsAudioGame: number;
        newWordsSprintGame: number;
        wordsInRowAudioGame: number;
        wordsInRowSprintGame: number;
        totalQuestionsAudioGame: number;
        totalQuestionSprintGame: number;
        totalCorrectAnswersAudioGame: number;
        totalCorrectAnswersSprintGame: number;
    };
};


const Statistics = () => {
    const [menuActive, setMenuActive] = useState<boolean>(false);
    

    const [stateData,setStateData] = useState<DataStat>()
    
    const dayResults = useCallback(async () => {
        const token = localStorage.getItem('token') as string;
        const userId = localStorage.getItem('userId') as string;
        const responseStat = (await Service.getUserStat(userId, token)) as DataStat;
        console.log(responseStat)
        setStateData(responseStat)
        
        
    },[]);
    
    useEffect(() => {
        dayResults();
    }, [dayResults]);
    const newWordsCount = stateData!.optional.newWordsAudioGame + stateData!.optional.newWordsSprintGame;
    const audioAnswers = ((stateData!.optional.totalCorrectAnswersAudioGame/stateData!.optional.totalQuestionsAudioGame)*100).toFixed(2);
    const sprintAnswers = ((stateData!.optional.totalCorrectAnswersSprintGame/stateData!.optional.totalQuestionSprintGame)*100).toFixed(2)
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
                            <p>{newWordsCount} 
                             шт</p>
                        </div>
                        <div className="stat-words_count">
                            <p>Изученных слов</p>
                            <p>{stateData?.learnedWords} шт</p>
                        </div>
                        <div className="stat-words_count">
                            <p>Правильных ответов</p>
                            <p>0 %</p>
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
                            <p>{audioAnswers}%</p>
                        </div>
                        <div className="stat-games_count">
                            <p>Самая длинная серия правильных ответов</p>
                            <p>{stateData?.optional.wordsInRowAudioGame} шт</p>
                        </div>
                    </div>
                </div>
                <div className="stat-games">
                    <h5>Спринт</h5>
                    <div className="stat-games_result">
                        <div className="stat-games_count">
                            <p>Новых слов</p>
                            <p>{stateData?.optional.newWordsSprintGame} шт</p>
                        </div>
                        <div className="stat-games_count">
                            <p>Правильных ответов</p>
                            <p> {sprintAnswers}%</p>
                        </div>
                        <div className="stat-games_count">
                            <p>Самая длинная серия правильных ответов</p>
                            <p>{stateData?.optional.wordsInRowSprintGame} шт</p>
                        </div>
                    </div>
                </div>
            </div>
            <h4>Долгосрочная статистика</h4>
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
            </LineChart>
            <Footer />
        </div>
    );
};
export default Statistics;


