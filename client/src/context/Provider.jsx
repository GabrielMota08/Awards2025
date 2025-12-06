import React, { useState, useEffect } from 'react';
import AppContext from './AppContext';
import PropTypes from 'prop-types';
import axios from 'axios';
import api from '../services/api'; 

function Provider({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const DEFAULT_TOKEN = 1;

    const [targetDate, setTargetDate] = useState(new Date("2030-01-01"));
    const [isVotingEnded, setIsVotingEnded] = useState(false);
    
    const shortlisted = []; 

    const [votes, setVotes] = useState({}); 
    
    const saveVote = (categoryId, nomineeName) => {
        setVotes((prev) => ({
            ...prev,
            [categoryId]: nomineeName
        }));
    };

    const fetchUserVotes = async (groupId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await api.get(`/my-votes/${groupId}`);
            setVotes(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error("Erro ao buscar votos anteriores:", error);
        }
    };

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            setIsVotingEnded(now > targetDate);
        };
        
        checkTime();
        
        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, [targetDate]);

    // --- 3. INICIALIZAÇÃO DO APP ---
    useEffect(() => {
        const initApp = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            let currentUser = null;

            // A. Validação de Login
            if (token && storedUser) {
                try {
                    const response = await axios.get("http://localhost:3001/validate-token", {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(() => null); 

                    if (response && response.data.valid) {
                        currentUser = JSON.parse(storedUser);
                        setUser(currentUser);
                        setIsAuthenticated(true);
                    } else {
                        currentUser = JSON.parse(storedUser);
                        setUser(currentUser);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error("Erro na validação de token", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }

            try {
                if (DEFAULT_TOKEN) {
                    const response = await api.get(`/vote-data/${DEFAULT_TOKEN}`);
                    
                    if (response.data.group) {
                        if (response.data.group.end_date) {
                            setTargetDate(new Date(response.data.group.end_date));
                        }

                        if (currentUser) {
                            await fetchUserVotes(response.data.group.id);
                        }
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar dados da votação padrão:", err);
            } finally {
                setIsLoading(false);
            }
        };

        initApp();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:3001/login", { email, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user)); 
                setUser(response.data.user);
                setIsAuthenticated(true);
                
                window.location.href = "/account"; 
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
        setIsAuthenticated(false);
        setVotes({}); 
        window.location.href = "/";
    };

    const value = {
        menuOpen, 
        setMenuOpen,
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
        votes,
        saveVote,
        fetchUserVotes,
        targetDate,
        setTargetDate,
        isVotingEnded,
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