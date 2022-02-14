import './Home.css';

const Footer = () => {
    console.log('hi');
    return (
        <div className="wrapper row6">
            <div id="copyright" className="clear">
                <a className="rss" href="https://rs.school/js/" rel="noopener">
                    {' '}
                    <span className="rss-year">`22</span>{' '}
                </a>
                <div className="githab">
                    <a href="/">Разработчик 1</a>
                    <a href="/">Разработчик 2</a>
                    <a href="/">Разработчик 3</a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
