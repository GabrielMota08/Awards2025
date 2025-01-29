import React, { useState } from 'react';
import AppContext from './AppContext';
import PropTypes from 'prop-types';

function Provider({ children }) {
    const [votes, setVotes] = useState({}); // { 0: "Filme A", 1: "Filme B", ... }
    const saveVote = (categoryIndex, vote) => {
        setVotes((prevVotes) => ({ ...prevVotes, [categoryIndex]: vote }));
    };

    const indicados = [
        { 
            id: 0, 
            categoria: "Melhor filme lançado no ano", 
            description: "Reconhecendo o filme mais marcante do ano, com destaque para narrativa e atuações.",
            nomeados: [
                { id: 0, name: "DEADPOOL & WOLVERINE", description: "SHAWN LEVY", img: "https://upload.wikimedia.org/wikipedia/pt/2/2a/Deadpool_%26_Wolverine_cartaz.jpg" },
                { id: 1, name: "BEEKEEPER: REDE DE VINGANÇA", description: "DAVID AYER", img: "https://m.media-amazon.com/images/M/MV5BNGEwYWU2NmQtNjU5NS00ZjkzLWE2ZTYtYzgzMjEzOGJhYWQwXkEyXkFqcGc@._V1_.jpg" },
                { id: 2, name: "MEU MALVADO FAVORITO 4", description: "CHRIS RENAUD", img: "https://ingresso-a.akamaihd.net/prd/img/movie/meu-malvado-favorito-4/4d756249-3b88-4b59-baa2-527f5e3d4c3e.webp" },
                { id: 3, name: "GARRA DE FERRO", description: "SEAN DURKIN", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
                { id: 4, name: "GUERRA SEM REGRAS", description: "GUY RITCHIE", img: "https://resizing.flixster.com/XOofxyC1iBne3Da7spP3GsfVtXQ=/206x305/v2/https://resizing.flixster.com/1eHwSs4Hsk8dmj_7g_HOVkw8x6U=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRiZTU3MTJhLTA4NjgtNDViYS05YTRlLWUzODcwMGExZWNlZC5qcGc=" }
            ] 
        },
        { 
            id: 1, 
            categoria: "Melhor live", 
            nomeados: [
                { id: 0, name: "O PIOR MECÂNICO DOS MARES! - BARONTRAUMA", description: "ALANZOKA", img: "https://i.ytimg.com/vi/xPQs7EW0AAw/maxresdefault.jpg" },
                { id: 1, name: "OS INCOMPETENTES VOLTARAM - LETHAL COMPANY", description: "ALANZOKA", img: "https://i.ytimg.com/vi/NUl026Y4VHM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBb8c19xYhbYwFnrKuE8r6verbHpg" },
                { id: 2, name: "MARIO PARTY VOLTOU! - MARIO PARTY: JAMBOREE COM OS INIMIGOS", description: "ALANZOKA", img: "https://i.ytimg.com/vi/60BP7rh0HT8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAW2ouV5yutEi2PLBPvG8-5Z3NBxQ" },
                { id: 3, name: "GARRA DE FERRO", description: "ALANZOKA", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
                { id: 4, name: "GUERRA SEM REGRAS", description: "ALANZOKA", img: "https://resizing.flixster.com/XOofxyC1iBne3Da7spP3GsfVtXQ=/206x305/v2/https://resizing.flixster.com/1eHwSs4Hsk8dmj_7g_HOVkw8x6U=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRiZTU3MTJhLTA4NjgtNDViYS05YTRlLWUzODcwMGExZWNlZC5qcGc=" }
            ] 
        },
        { 
            id: 2, 
            categoria: "Melhor atriz", 
            nomeados: [
                { id: 0, name: "DEADPOOL & WOLVERINE", description: "SHAWN LEVY", img: "https://upload.wikimedia.org/wikipedia/pt/2/2a/Deadpool_%26_Wolverine_cartaz.jpg" },
                { id: 1, name: "BEEKEEPER: REDE DE VINGANÇA", description: "DAVID AYER", img: "https://m.media-amazon.com/images/M/MV5BNGEwYWU2NmQtNjU5NS00ZjkzLWE2ZTYtYzgzMjEzOGJhYWQwXkEyXkFqcGc@._V1_.jpg" },
                { id: 2, name: "MEU MALVADO FAVORITO 4", description: "CHRIS RENAUD", img: "https://ingresso-a.akamaihd.net/prd/img/movie/meu-malvado-favorito-4/4d756249-3b88-4b59-baa2-527f5e3d4c3e.webp" },
                { id: 3, name: "GARRA DE FERRO", description: "SEAN DURKIN", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
                { id: 4, name: "GUERRA SEM REGRAS", description: "GUY RITCHIE", img: "https://resizing.flixster.com/XOofxyC1iBne3Da7spP3GsfVtXQ=/206x305/v2/https://resizing.flixster.com/1eHwSs4Hsk8dmj_7g_HOVkw8x6U=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRiZTU3MTJhLTA4NjgtNDViYS05YTRlLWUzODcwMGExZWNlZC5qcGc=" }
            ] 
        },
        { 
            id: 3, 
            categoria: "Melhor direção", 
            nomeados: [
                { id: 0, name: "DEADPOOL & WOLVERINE", description: "SHAWN LEVY", img: "https://upload.wikimedia.org/wikipedia/pt/2/2a/Deadpool_%26_Wolverine_cartaz.jpg" },
                { id: 1, name: "BEEKEEPER: REDE DE VINGANÇA", description: "DAVID AYER", img: "https://m.media-amazon.com/images/M/MV5BNGEwYWU2NmQtNjU5NS00ZjkzLWE2ZTYtYzgzMjEzOGJhYWQwXkEyXkFqcGc@._V1_.jpg" },
                { id: 2, name: "MEU MALVADO FAVORITO 4", description: "CHRIS RENAUD", img: "https://ingresso-a.akamaihd.net/prd/img/movie/meu-malvado-favorito-4/4d756249-3b88-4b59-baa2-527f5e3d4c3e.webp" },
                { id: 3, name: "GARRA DE FERRO", description: "SEAN DURKIN", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
                { id: 4, name: "GUERRA SEM REGRAS", description: "GUY RITCHIE", img: "https://resizing.flixster.com/XOofxyC1iBne3Da7spP3GsfVtXQ=/206x305/v2/https://resizing.flixster.com/1eHwSs4Hsk8dmj_7g_HOVkw8x6U=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRiZTU3MTJhLTA4NjgtNDViYS05YTRlLWUzODcwMGExZWNlZC5qcGc=" }
            ]  
        },
        { 
            id: 4, 
            categoria: "Melhor direção", 
            nomeados: [
                { id: 0, name: "DEADPOOL & WOLVERINE", description: "SHAWN LEVY", img: "https://upload.wikimedia.org/wikipedia/pt/2/2a/Deadpool_%26_Wolverine_cartaz.jpg" },
                { id: 1, name: "BEEKEEPER: REDE DE VINGANÇA", description: "DAVID AYER", img: "https://m.media-amazon.com/images/M/MV5BNGEwYWU2NmQtNjU5NS00ZjkzLWE2ZTYtYzgzMjEzOGJhYWQwXkEyXkFqcGc@._V1_.jpg" },
                { id: 2, name: "MEU MALVADO FAVORITO 4", description: "CHRIS RENAUD", img: "https://ingresso-a.akamaihd.net/prd/img/movie/meu-malvado-favorito-4/4d756249-3b88-4b59-baa2-527f5e3d4c3e.webp" },
                { id: 3, name: "GARRA DE FERRO", description: "SEAN DURKIN", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
                { id: 4, name: "GUERRA SEM REGRAS", description: "GUY RITCHIE", img: "https://resizing.flixster.com/XOofxyC1iBne3Da7spP3GsfVtXQ=/206x305/v2/https://resizing.flixster.com/1eHwSs4Hsk8dmj_7g_HOVkw8x6U=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRiZTU3MTJhLTA4NjgtNDViYS05YTRlLWUzODcwMGExZWNlZC5qcGc=" }
            ]  
        },
        { 
            id: 5, 
            categoria: "Melhor direção", 
            nomeados: [
                { id: 0, name: "DEADPOOL & WOLVERINE", description: "SHAWN LEVY", img: "https://upload.wikimedia.org/wikipedia/pt/2/2a/Deadpool_%26_Wolverine_cartaz.jpg" },
                { id: 1, name: "BEEKEEPER: REDE DE VINGANÇA", description: "DAVID AYER", img: "https://m.media-amazon.com/images/M/MV5BNGEwYWU2NmQtNjU5NS00ZjkzLWE2ZTYtYzgzMjEzOGJhYWQwXkEyXkFqcGc@._V1_.jpg" },
                { id: 2, name: "MEU MALVADO FAVORITO 4", description: "CHRIS RENAUD", img: "https://ingresso-a.akamaihd.net/prd/img/movie/meu-malvado-favorito-4/4d756249-3b88-4b59-baa2-527f5e3d4c3e.webp" },
                { id: 3, name: "GARRA DE FERRO", description: "SEAN DURKIN", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
                { id: 4, name: "GUERRA SEM REGRAS", description: "GUY RITCHIE", img: "https://resizing.flixster.com/XOofxyC1iBne3Da7spP3GsfVtXQ=/206x305/v2/https://resizing.flixster.com/1eHwSs4Hsk8dmj_7g_HOVkw8x6U=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRiZTU3MTJhLTA4NjgtNDViYS05YTRlLWUzODcwMGExZWNlZC5qcGc=" }
            ] 
        }, 
        { 
            id: 6, 
            categoria: "Melhor série", 
            nomeados: [
                { id: 0, name: "DEADPOOL & WOLVERINE", description: "SHAWN LEVY", img: "https://upload.wikimedia.org/wikipedia/pt/2/2a/Deadpool_%26_Wolverine_cartaz.jpg" },
                { id: 1, name: "BEEKEEPER: REDE DE VINGANÇA", description: "DAVID AYER", img: "https://m.media-amazon.com/images/M/MV5BNGEwYWU2NmQtNjU5NS00ZjkzLWE2ZTYtYzgzMjEzOGJhYWQwXkEyXkFqcGc@._V1_.jpg" },
                { id: 2, name: "MEU MALVADO FAVORITO 4", description: "CHRIS RENAUD", img: "https://ingresso-a.akamaihd.net/prd/img/movie/meu-malvado-favorito-4/4d756249-3b88-4b59-baa2-527f5e3d4c3e.webp" },
                { id: 3, name: "GARRA DE FERRO", description: "SEAN DURKIN", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
                { id: 4, name: "GUERRA SEM REGRAS", description: "GUY RITCHIE", img: "https://resizing.flixster.com/XOofxyC1iBne3Da7spP3GsfVtXQ=/206x305/v2/https://resizing.flixster.com/1eHwSs4Hsk8dmj_7g_HOVkw8x6U=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRiZTU3MTJhLTA4NjgtNDViYS05YTRlLWUzODcwMGExZWNlZC5qcGc=" }
            ] 
        },
    ];
    


    const value = {
        votes,
        saveVote,
        indicados,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export default Provider;

Provider.propTypes = {
    children: PropTypes.any,
}.isRequired;
