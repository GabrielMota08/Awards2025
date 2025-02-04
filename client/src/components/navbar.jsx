import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import awards from "../assets/awards.png";
import { BsPerson } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import "./navbar.modules.css";
import AppContext from "../context/AppContext";

const Navbar = () => {
    const { menuOpen, setMenuOpen, targetDate } = useContext(AppContext);

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
        <nav id="navbar">
            <h2>
                <Link to="/">
                    <img src={awards} alt="logo" className="logoImg" />
                </Link>
            </h2>
            <div className="optionsNavbar">
                {menuOpen ? (
                    <button
                        className="menuOpenButton"
                        onClick={() => setMenuOpen(false)}
                    >
                        <IoMdMenu />
                    </button>
                ) : (
                    <>
                        {new Date() > targetDate ? (
                            <Link to="/winners/0"><p>VENCEDORES</p></Link>
                        ) : (
                            <p className="winnerNavbarButton">VENCEDORES</p>
                        )}
                        <Link to="/nominees/0"><p>VOTAÇÃO</p></Link>
                        <Link to="/categories"><p>CATEGORIAS</p></Link>
                    </>
                )}
            </div>
            <div className={menuOpen ? "marginTop0em" : ""}>
                <Link to="/">
                    <BsPerson />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
