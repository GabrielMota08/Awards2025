import React, { useState, useEffect } from "react";
import logo2 from "../../assets/logo_reduzido.png";
import "./Home.modules.css";

const Home = () => {
    const targetDate = new Date("2025-01-12T18:59:59");

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
                <div className="description">
                    <button>CONHEÇA OS INDICADOS</button>
                </div>
                <div className="timer">
                    <h2>OS VENCEDORES SERÃO REVELADOS EM:</h2>
                    <div className="clock">
                        <p>{days}</p>:
                        <p>{hours}</p>:
                        <p>{minutes}</p>:
                        <p>{seconds}</p>
                    </div>
                    <button>VOTE AGORA</button>
                </div>
            </section>
            <section>
            </section>
        </div>
    );
};

export default Home;
