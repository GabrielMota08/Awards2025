import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AppContext from './AppContext';
import PropTypes from 'prop-types';
import axios from 'axios';
import api from '../services/api'; 

function Provider({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const DEFAULT_TOKEN = "1";

    const [targetDate, setTargetDate] = useState(new Date("2030-01-01"));
    const [isVotingEnded, setIsVotingEnded] = useState(false);
    
    const [themeBg, setThemeBg] = useState("Purple"); 
    
    const shortlisted = []; 
    const [votes, setVotes] = useState({}); 

    const saveVote = useCallback((categoryId, nomineeName) => {
        setVotes((prev) => ({
            ...prev,
            [categoryId]: nomineeName
        }));
    }, []);

    const fetchUserVotes = useCallback(async (groupId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await api.get(`/my-votes/${groupId}`);
            setVotes(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error("Erro ao buscar votos anteriores:", error);
        }
    }, []);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            setIsVotingEnded(now > targetDate);
        };
        checkTime();
        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, [targetDate]);

    useEffect(() => {
        const initApp = async () => {
            const tokenLS = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            let currentUser = null;

            if (tokenLS && storedUser) {
                try {
                    const response = await axios.get("http://localhost:3001/validate-token", {
                        headers: { Authorization: `Bearer ${tokenLS}` }
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
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }

            try {
                const path = window.location.pathname;
                
                let match = path.match(/\/(?:nominees|winners|categories)\/([^\/]+)/);
                let tokenToFetch = match ? match[1] : null;

                if (!tokenToFetch) {
                    const potentialToken = path.split('/')[1];
                    const systemRoutes = ["", "auth", "account", "login", "register"];
                    
                    if (potentialToken && !systemRoutes.includes(potentialToken)) {
                        tokenToFetch = potentialToken;
                    }
                }

                tokenToFetch = tokenToFetch || DEFAULT_TOKEN;

                if (tokenToFetch) {
                    const response = await api.get(`/vote-data/${tokenToFetch}`, { skipAuthRedirect: true });
                    const data = response.data;
                    
                    if (data.group) {
                        if (data.group.end_date) {
                            setTargetDate(new Date(data.group.end_date));
                        }

                        if (data.group.theme) {
                            const color = data.group.theme === "#24398e" ? "Blue" : "Purple";
                            setThemeBg(color);
                        } else {
                            setThemeBg("Purple");
                        }

                        if (currentUser) {
                            await fetchUserVotes(data.group.id);
                        }
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar dados da votação:", err);
            } finally {
                setIsLoading(false);
            }
        };

        initApp();
    }, [fetchUserVotes]);

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

    const value = useMemo(() => ({
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
        shortlisted,
        themeBg, 
        setThemeBg
    }), [menuOpen, user, isLoading, isAuthenticated, votes, saveVote, fetchUserVotes, targetDate, isVotingEnded, shortlisted, themeBg]);

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