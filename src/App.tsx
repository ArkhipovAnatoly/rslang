import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import './Components/LogIn/LogIn.css';
import { GlobalContextProvider } from './GlobalContext';
import Authorization from './Components/LogIn/Authorization/Authorization';
import Registration from './Components/LogIn/Registration/Registration';
import Book from './Components/Book/Book';

function App() {
    return (
        <Router>
            <GlobalContextProvider>
                <Routes>
                    <Route path="/" element={<h1>Home Page</h1>} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/authorization" element={<Authorization />} />
                    <Route path="/book/:group/:page" element={<Book />} />
                </Routes>
            </GlobalContextProvider>
        </Router>
    );
}

export default App;
