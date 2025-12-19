import React, { useEffect, useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import awards from "../assets/awards.png";
import { BsPerson } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import styles from "./navbar.module.css";
import AppContext from "../context/AppContext";

const Navbar = () => {
    const { menuOpen, setMenuOpen, isVotingEnded, themeBg, user } = useContext(AppContext);
    const { token, id } = useParams();
    
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 700px)");

        const handleResize = (e) => {
            setIsMobile(e.matches);
            if (!e.matches) {
                setMenuOpen(false);
            }
        };

        handleResize(mediaQuery); 

        mediaQuery.addEventListener("change", handleResize);

        return () => mediaQuery.removeEventListener("change", handleResize);
    }, [setMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            if (isMobile) {
                setMenuOpen(true); 
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile, setMenuOpen]);

    return (
        <nav id={styles.navbar} className={styles[`navbar${themeBg || "Purple"}`]}>
            <h2>
                <Link to={`/${token || "1"}`}>
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
                        {isVotingEnded ? (
                            <Link to={`/winners/${token || 1}/${id || 0}`}><p>VENCEDORES</p></Link>
                        ) : (
                            <p className={styles.winnerNavbarButton}>VENCEDORES</p>
                        )}
                        
                        <Link to={`/nominees/${token || 1}/${id || 0}`}><p>VOTAÇÃO</p></Link>
                        <Link to={`/categories/${token || 1}`}><p>CATEGORIAS</p></Link>
                    </>
                )}
            </div>
            <div className={menuOpen ? styles.marginTop0em : ""}>
                <Link to={!user ? "/auth" : "/account"}>
                    <BsPerson />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;