import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import './Components/LogIn/LogIn.css';
import { GlobalContextProvider } from './GlobalContext';
import Authorization from './Components/LogIn/Authorization/Authorization';
import Registration from './Components/LogIn/Registration/Registration';
import Book from './Components/Book/Book';
import Games from './Components/Games/Games';
import AudioGame from './Components/Games/AudioGame/AudioGame';
import Sprint from './Components/Games/Sprint/Sprint';
import Home from './Components/Home/Home';
import Statistics from './Components/Statistics/Statistics';
import BookInfo from './Components/Home/About/BookInfo';
import StatInfo from './Components/Home/About/StatInfo';
import GameInfo from './Components/Home/About/GameInfo';
import Error from './Components/Errors/Error';
import PageExplored from './Components/Games/PageExplored';

function App() {
    return (
        <Router>
            <GlobalContextProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/authorization" element={<Authorization />} />
                    <Route path="/book/:group/:page" element={<Book />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/games/:group/:page" element={<Games />} />
                    <Route path="/audioGame" element={<AudioGame />} />
                    <Route path="/audioGame/:group/:page" element={<AudioGame />} />
                    <Route path="/sprint/" element={<Sprint />} />
                    <Route path="/sprint/:group/:page" element={<Sprint />} />
                    <Route path="/sprint" element={<Sprint />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/bookInfo" element={<BookInfo />} />
                    <Route path="/statInfo" element={<StatInfo />} />
                    <Route path="/gameInfo" element={<GameInfo />} />
                    <Route path="*" element={<Error />} />
                    <Route path="/book/:group/:page/pageExplored" element={<PageExplored />} />
                </Routes>
            </GlobalContextProvider>
        </Router>
    );
}

export default App;
