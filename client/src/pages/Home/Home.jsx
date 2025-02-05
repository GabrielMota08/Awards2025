import React, { useState, useEffect, useContext } from "react";
import logo2 from "../../assets/logo_reduzido.png";
import logoFooter from "../../assets/awards.png";
import "./Home.modules.css";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { GoChevronDown } from "react-icons/go";
const Home = () => {
    const { shortlisted, targetDate } = useContext(AppContext);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const handleScroll = () => {
        const target = document.getElementById("scrollTarget");
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const { days, hours, minutes, seconds } = timeLeft;

    return (
        <div className="home">
            {/* <div className="topHome"></div> */}
            <section className="pageElements">
                <div className="title">
                    <img src={logo2} alt="Logo2"></img>
                    <h1 className="titleAwards">AWARDS MELHORES DO ANO</h1>
                </div>
                <section className="subtitle">
                <div className="description">
                    <Link className={new Date() < targetDate && "disableWinners"} to="/winners/0">CONFIRA OS VENCEDORES</Link>
                    <Link to="/categories">VEJA OS INDICADOS</Link>
                </div>
                <div className="timer">
                    <h2>OS VENCEDORES SERÃO REVELADOS EM:</h2>
                    <div className="clock">
                        <p>{days}</p>:
                        <p>{hours}</p>:
                        <p>{minutes}</p>:
                        <p>{seconds}</p>
                    </div>
                    <Link to="/nominees/0">VOTE AGORA</Link>
                </div>
                </section>
                <div id="scrollTarget" className="arrowDown"><p onClick={handleScroll}><GoChevronDown /></p></div>
            </section>
            <section className="honors">
            <p className="honorsTitle">MENÇÕES</p>
            <div>
                {shortlisted.map((indicado) => (
                    <li className="honorsCard" key={indicado.id}>
                        <img src={indicado.img}
                        alt={indicado.name}
                        onLoad={(e) => {
                            const img = e.target;
                            const parent = img.parentNode;
                            parent.classList.remove("honorsCardA", "honorsCardB");
                            if (img.naturalWidth > img.naturalHeight) {
                                parent.classList.add("honorsCardB");
                            } else {
                                parent.classList.add("honorsCardA");
                            }
                        }}></img>
                        <h2>{indicado.name}</h2>
                        <p>{indicado.description}</p>
                    </li>
                ))}
            </div>
            </section>
            <section className="footer">
                <div className="footerLogo">
                    <img src={logoFooter} alt="LogoFooter"></img>
                    <h1 className="titleFooter">AWARDS MELHORES DO ANO</h1>
                </div>
                <p>© 2024</p>
            </section>
        </div>
    );
};

export default Home;
