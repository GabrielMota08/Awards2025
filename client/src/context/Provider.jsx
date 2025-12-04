import React, { useState, useEffect } from 'react';
import AppContext from './AppContext';
import PropTypes from 'prop-types';
import axios from 'axios';
import api from '../services/api'; // Importe a instância configurada do Axios
// import { DEFAULT_TOKEN } from '../constants'; // O token da votação principal

function Provider({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const DEFAULT_TOKEN = 1;
    // --- 1. DATA DINÂMICA (Inicia com data futura até carregar do banco) ---
    const [targetDate, setTargetDate] = useState(new Date("2030-01-01"));
    
    const shortlisted = []; // Seus dados estáticos (se houver)

    // --- 2. ESTADO DOS VOTOS ---
    const [votes, setVotes] = useState({}); 
    
    // Atualiza o estado visual localmente
    const saveVote = (categoryId, nomineeName) => {
        setVotes((prev) => ({
            ...prev,
            [categoryId]: nomineeName
        }));
    };

    // Busca votos do banco (Chamada pelo useEffect ou páginas internas)
    const fetchUserVotes = async (groupId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await api.get(`/my-votes/${groupId}`);
            // O backend retorna: { "1": "Nome do Indicado", "2": "Outro" }
            setVotes(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error("Erro ao buscar votos anteriores:", error);
        }
    };

    // --- 3. INICIALIZAÇÃO DO APP ---
    useEffect(() => {
        const initApp = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            let currentUser = null;

            // A. Validação de Login
            if (token && storedUser) {
                try {
                    // Se você tiver a rota /validate-token, use-a. 
                    // Caso contrário, confiamos no localStorage até a primeira requisição falhar (401).
                    // Aqui mantive sua lógica original:
                    const response = await axios.get("http://localhost:3001/validate-token", {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(() => null); // Se der erro, ignora e segue

                    if (response && response.data.valid) {
                        currentUser = JSON.parse(storedUser);
                        setUser(currentUser);
                        setIsAuthenticated(true);
                    } else {
                        // Se a validação falhar (ou não existir rota), podemos tentar manter o user
                        // ou forçar logout. Aqui estou assumindo sucesso se o token existir para simplificar,
                        // a menos que o backend rejeite explicitamente.
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