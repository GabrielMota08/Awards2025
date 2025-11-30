import React, { useState, useEffect } from 'react';
import AppContext from './AppContext';
import PropTypes from 'prop-types';
import axios from 'axios';

function Provider({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const shortlisted = []
    // --- RESTAURADO: Estado visual dos votos ---
    const [votes, setVotes] = useState({}); 
    const saveVote = (categoryId, nomineeName) => {
        setVotes((prev) => ({
            ...prev,
            [categoryId]: nomineeName
        }));
        console.log(JSON.stringify(votes))
    };
    // -------------------------------------------

    const targetDate = new Date("2026-02-04T22:59:59");

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:3001/login", { email, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user)); 
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, msg: response.data.msg };
        } catch (error) {
            return { success: false, msg: "Erro de conexão" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setVotes({}); // Limpa votos visuais ao sair
        window.location.href = "/";
    };

    const value = {
        menuOpen, 
        setMenuOpen,
        user,
        login,
        logout,
        isLoading,
        votes,      // Volta a estar disponível
        saveVote,   // Volta a estar disponível
        targetDate,  // Disponível para Indicados/Winners
        shortlisted
    };

    return (
        <AppContext.Provider value={value}>
            {!isLoading && children}
        </AppContext.Provider>
    );
}

export default Provider;

Provider.propTypes = {
    children: PropTypes.any,
};