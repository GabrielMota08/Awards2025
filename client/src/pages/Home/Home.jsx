import React, { useState, useEffect, useContext } from "react";
import logo2 from "../../assets/logo_reduzido.png";
import logoFooter from "../../assets/awards.png";
import styles from "./Home.module.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { GoChevronDown } from "react-icons/go";
import { FaPlusCircle } from "react-icons/fa";
import api from "../../services/api";

const Home = () => {
    const { shortlisted, targetDate, setTargetDate, themeBg } = useContext(AppContext);
    const { token, id } = useParams();
    const navigate = useNavigate();

    const activeToken = token || "1";

    const [accessLink, setAccessLink] = useState("");
    
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // useEffect(() => {
    //     const fetchHomeData = async () => {
    //         try {
    //             const response = await api.get(`/vote-data/${activeToken}`, { skipAuthRedirect: true });
    //             const data = response.data;

    //             if (data.group && data.group.end_date) {
    //                 setTargetDate(new Date(data.group.end_date));
    //             }
            

    //         } catch (err) {
    //             console.error("Erro ao carregar dados da Home:", err);
    //         }
    //     };

    //     fetchHomeData();
    // }, [activeToken, setTargetDate]);

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
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    const { days, hours, minutes, seconds } = timeLeft;

    const handleAccess = () => {
        if (!accessLink) return;
        if (accessLink.includes("http")) {
            window.location.href = accessLink;
        } else {
            navigate(`/nominees/${accessLink}/0`);
        }
    };

    return (
        <div className={styles.home}>
            <section className={`${styles.pageElements} ${styles[`pageElements${themeBg || "Purple"}`]}`}>
                <div className={styles.title}>
                    <img src={logo2} alt="Logo2" />
                    <h1 className={styles.titleAwards}>AWARDS MELHORES DO ANO</h1>
                </div>

                <section className={styles.subtitle}>
                    <div className={`${styles.description} ${styles[`description${themeBg || "Purple"}`]}`}>
                        <Link
                            className={new Date() < targetDate ? styles.disableWinners : ""}
                            to={`/winners/${activeToken}/${id || 0}`}
                        >
                            CONFIRA OS VENCEDORES
                        </Link>

                        <Link to={`/categories/${activeToken}`}>VEJA OS INDICADOS</Link>
                    </div>

                    <div className={styles.timer}>
                        <h2>OS VENCEDORES SERÃO REVELADOS EM:</h2>

                        <div className={styles.clock}>
                            <p>{days}</p>:
                            <p>{hours}</p>:
                            <p>{minutes}</p>:
                            <p>{seconds}</p>
                        </div>

                        <Link to={`/nominees/${activeToken}/${id || 0}`}>VOTE AGORA</Link>
                    </div>
                </section>

                <div id="scrollTarget" className={styles.arrowDown}>
                    <p onClick={handleScroll}>
                        <GoChevronDown />
                    </p>
                </div>
            </section>

            {shortlisted && shortlisted.length > 0 && (
                <section className={styles.honors}>
                    <p className={styles.honorsTitle}>MENÇÕES</p>
                    <div>
                        {shortlisted.map((indicado) => (
                            <li className={styles.honorsCard} key={indicado.id}>
                                <img
                                    src={indicado.img}
                                    alt={indicado.name}
                                    onLoad={(e) => {
                                        const img = e.target;
                                        const parent = img.parentNode;
                                        parent.classList.remove(styles.honorsCardA, styles.honorsCardB);
                                        if (img.naturalWidth > img.naturalHeight) {
                                            parent.classList.add(styles.honorsCardB);
                                        } else {
                                            parent.classList.add(styles.honorsCardA);
                                        }
                                    }}
                                />
                                <h2>{indicado.name}</h2>
                                <p>{indicado.description}</p>
                            </li>
                        ))}
                    </div>
                </section>
            )}

            <section className={styles.create}>
                <p className={styles.honorsTitle}>
                    PARTICIPE AGORA
                </p>
                
                <div className={styles.createOptionsContainer}>
                    <div className={styles.createBox}>
                        <h3>Já tem um link?</h3>
                        <p className={styles.boxDesc}>Cole o link da votação abaixo para acessar.</p>
                        <div className={styles.inputGroup}>
                            <input 
                                type="text" 
                                placeholder={token ? token : "Cole o link ou token aqui..." }
                                value={accessLink}
                                onChange={(e) => setAccessLink(e.target.value)}
                            />
                            <button onClick={handleAccess}>
                                ACESSAR
                            </button>
                        </div>
                    </div>

                    <Link to="/account" className={styles.createBoxLink}>
                        <div className={styles.createBoxContent}>
                            <FaPlusCircle className={styles.createIcon} />
                            <h3>Crie sua Votação</h3>
                            <p className={styles.boxDesc}>Comece do zero e compartilhe com seus amigos.</p>
                        </div>
                    </Link>
                </div>
            </section>

            <section className={styles.footer}>
                <div className={styles.footerLogo}>
                    <img src={logoFooter} alt="LogoFooter" />
                    <h1 className={styles.titleFooter}>AWARDS MELHORES DO ANO</h1>
                </div>
                <p>© 2024</p>
            </section>
        </div>
    );
};

export default Home;