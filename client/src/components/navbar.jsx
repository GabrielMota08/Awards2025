import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import awards from "../assets/awards.png";
import { BsPerson } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import "./navbar.modules.css";
import AppContext from "../context/AppContext";

const Navbar = () => {
    const {menuOpen, setMenuOpen, targetDate} = useContext(AppContext);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 700px)");
        const handleResize = (e) => {
            setMenuOpen(e.matches);
        };

        // Inicializa com o estado atual da mídia
        handleResize(mediaQuery);

        // Adiciona o listener
        mediaQuery.addEventListener("change", handleResize);
        console.log("Adicionei o evento")
        // Remove o listener ao desmontar
        return () => {mediaQuery.removeEventListener("change", handleResize)
            console.log("Removi o evento")
        };
    }, []);

    return (
        <nav id="navbar">
            <h2>
                <Link to="/">
                    <img src={awards} alt="logo" className="logoImg" />
                </Link>
            </h2>
            <div className="optionsNavbar">
                {menuOpen ? (
                    <button className="menuOpenButton" onClick={() => setMenuOpen(false)}>
                        <IoMdMenu />
                    </button>
                ) : (
                    <>
                        {new Date() > targetDate ? <Link to="/winners/0"><p>VENCEDORES</p></Link> : <p className="winnerNavbarButton">VENCEDORES</p>}
                        <Link to="/nominees/0"><p>VOTAÇÃO</p></Link>
                        <Link to="/categories"><p>CATEGORIAS</p></Link>
                    </>
                )}
            </div>
            <div className={menuOpen && "marginTop0em"}>
                <Link to="/">
                    <BsPerson />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
