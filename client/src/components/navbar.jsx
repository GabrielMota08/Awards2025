import React, { useEffect, useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import awards from "../assets/awards.png";
import { BsPerson } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import styles from "./navbar.module.css";
import AppContext from "../context/AppContext";

const Navbar = () => {
    const { menuOpen, setMenuOpen, targetDate } = useContext(AppContext);
    const { token } = useParams();
    // Estado local para controlar o comportamento do menu no tamanho da tela
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 700px)");

        const handleResize = (e) => {
            setIsMobile(e.matches);
            if (!e.matches) {
                // Se for maior que 700px, garantir que o menu permaneça aberto
                setMenuOpen(false);
            }
        };

        handleResize(mediaQuery); // Inicializa com o estado atual da tela

        mediaQuery.addEventListener("change", handleResize);

        return () => mediaQuery.removeEventListener("change", handleResize);
    }, [setMenuOpen]);

    // Controla o comportamento do menu ao rolar a tela
    useEffect(() => {
        const handleScroll = () => {
            if (isMobile) {
                setMenuOpen(true); // Abre o menu se estiver em uma tela pequena e rolar a página
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile, setMenuOpen]);

    return (
        <nav id={styles.navbar}>
            <h2>
                <Link to="/">
                    <img src={awards} alt="logo" className={styles.logoImg} />
                </Link>
            </h2>
            <div className={styles.optionsNavbar}>
                {menuOpen ? (
                    <button
                        className={styles.menuOpenButton}
                        onClick={() => setMenuOpen(false)}
                    >
                        <IoMdMenu />
                    </button>
                ) : (
                    <>
                        {new Date() > targetDate ? (
                            <Link to={`/winners/${token || 1}/0`}><p>VENCEDORES</p></Link>
                        ) : (
                            <p className={styles.winnerNavbarButton}>VENCEDORES</p>
                        )}
                        <Link to={`/nominees/${token || 1}/0`}><p>VOTAÇÃO</p></Link>
                        <Link to={`/categories/${token || 1}`}><p>CATEGORIAS</p></Link>
                    </>
                )}
            </div>
            <div className={menuOpen ? styles.marginTop0em : ""}>
                <Link to="/auth">
                    <BsPerson />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
