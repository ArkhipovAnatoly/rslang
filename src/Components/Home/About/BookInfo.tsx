import { useState } from 'react';
import { Link } from 'react-router-dom';
import './about.css';
import Header from '../Header';
import Footer from '../Footer';
import Menu from '../../Menu/Menu';

const BookInfo = () => {
    const [menuActive, setMenuActive] = useState<boolean>(false);
    return (
        <div className="info_wrapper">
            <Header menuActive={menuActive} setMenuActive={setMenuActive} />
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />

            <h2 className="info-title">Словарь</h2>
            <div className="info-image1" />
            <div className="info-description">
                <p>
                    В учебнике собраны 3600 самых используемых в повседневной жизни слов, есть его определение и примеры
                    использования как на русском, так и на английском!
                </p>
                <p>Слова в коллекции отсортированы от более простых и известных к более сложным.</p>
                <p>
                    Вся коллекция разбита на шесть разделов, в каждом разделе 30 страниц, на каждой странице 20 слов для
                    изучения. Cедьмой раздел учебника - Сложные слова
                </p>
                <p>
                    Все слова, которые ты изучил попадают в твой личный словарь. Можно отметить сложные для тебя слова,
                    чтобы знать, на что чаще обращать внимание!{' '}
                </p>
                <p>
                    Если сложное слово стало изученным, оно перестаёт быть сложными и удаляется из раздела Сложные слова
                </p>
            </div>
            <Link className="arrow-back" to="/" />
            <Footer />
        </div>
    );
};

export default BookInfo;
