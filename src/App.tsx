import { Route, Routes } from 'react-router-dom';

import './App.css';
import './Components/LogIn/LogIn.css';
import Home from './Components/Home/Home';
// import Book from './Components/Dictionary/Book';
import { GlobalContextProvider } from './GlobalContext';
import Authorization from './Components/LogIn/Authorization/Authorization';
import Registration from './Components/LogIn/Registration/Registration';

function App() {
    return (
        <GlobalContextProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/authorization" element={<Authorization />} />
                {/* <Route path="/book/:group/:page" element={<Book />} /> */}
            </Routes>
        </GlobalContextProvider>
    );
}

export default App;
