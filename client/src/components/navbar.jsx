import React from "react";
import { Link } from "react-router-dom";
import awards from "../assets/awards.png";
import user from "../assets/user.png";

import "./navbar.modules.css";

const Navbar = () => {

    return (
        <nav id="navbar">
            <h2>
                <Link to="/">
                    <img src={awards} alt="logo" className="logoImg"/>
                </Link>
            </h2>
            <div className="optionsNavbar">
                <Link to="/winners"><p>VENCEDORES</p></Link>
                <Link to="/vote"><p>VOTAÇÃO</p></Link>
                <Link to="/categories"><p>CATEGORIAS</p></Link>
            </div>
            <div>
            <Link to="/login">
                    <img src={user} alt="user" className="userImg"/>
            </Link>
            </div>
        </nav>
    );
};

export default Navbar;
