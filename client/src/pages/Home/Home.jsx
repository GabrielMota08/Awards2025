import React, { useState, useEffect } from "react";
import logo2 from "../../assets/logo_reduzido.png";
import "./Home.modules.css";
import { Link } from "react-router-dom";

const Home = () => {
    const targetDate = new Date("2025-01-20T18:59:59");

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

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
                    <h1>AWARDS MELHOR DO ANO</h1>
                </div>
                <section className="subtitle">
                <div className="description">
                    <Link to="/categories">CONHEÇA OS INDICADOS</Link>
                </div>
                <div className="timer">
                    <h2>OS VENCEDORES SERÃO REVELADOS EM:</h2>
                    <div className="clock">
                        <p>{days}</p>:
                        <p>{hours}</p>:
                        <p>{minutes}</p>:
                        <p>{seconds}</p>
                    </div>
                    <Link to="/vote">VOTE AGORA</Link>
                </div>
                </section>
            </section>
            <section className="honors">
            <p>MENÇÕES HONROSAS</p>
            <div>
                <h1><img src=""></img><h2>DEADPOOL & WOLVERINE</h2><p>MELHOR FILME</p></h1>
            </div>
            </section>
        </div>
    );
};

export default Home;
