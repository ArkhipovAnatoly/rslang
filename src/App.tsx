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
                    <Route path="/sprint/:group/:page" element={<Sprint />} />
                    <Route path="/sprint" element={<Sprint />} />
                    <Route path="/statistics" element={<Statistics />} />
                </Routes>
            </GlobalContextProvider>
        </Router>
    );
}

export default App;
