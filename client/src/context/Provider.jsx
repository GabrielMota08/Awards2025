import React, { useState } from 'react';
import AppContext from './AppContext';
import PropTypes from 'prop-types';

function Provider({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const targetDate = new Date("2025-02-04T18:59:59");

    const [votes, setVotes] = useState({}); // { 0: "Filme A", 1: "Filme B", ... }
    const saveVote = (categoryIndex, vote) => {
        setVotes((prevVotes) => {
            const newVotes = { ...prevVotes };
            
            if (vote === undefined) {
              delete newVotes[categoryIndex];
            } else {
              newVotes[categoryIndex] = vote;
            }
            //console.log("Novo estado de votos:", newVotes);
            return newVotes;
          });
    };

    const shortlisted  = [ // Aqueles que não estão concorrendo
        { id: 0, name: "GUERRA SEM REGRAS", description: "MELHOR FILME LANÇADO NO ANO", img: "https://resizing.flixster.com/XOofxyC1iBne3Da7spP3GsfVtXQ=/206x305/v2/https://resizing.flixster.com/1eHwSs4Hsk8dmj_7g_HOVkw8x6U=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRiZTU3MTJhLTA4NjgtNDViYS05YTRlLWUzODcwMGExZWNlZC5qcGc=" },
        { id: 1, name: "MEU MALVADO FAVORITO 4", description: "MELHOR FILME LANÇADO NO ANO", img: "https://ingresso-a.akamaihd.net/prd/img/movie/meu-malvado-favorito-4/4d756249-3b88-4b59-baa2-527f5e3d4c3e.webp" },
        { id: 2, name: "HOBBIT: A GUERRA DOS CINCO EXÉRCITOS", description: "MELHOR FILME", img: "https://upload.wikimedia.org/wikipedia/pt/0/0e/The_Hobbit_-_The_Battle_of_the_Five_Armies.jpg" },
        { id: 3, name: "O SENHOR DOS ANÉIS: A SOCIEDADE DO ANEL", description: "MELHOR FILME", img: "https://br.web.img3.acsta.net/medias/nmedia/18/92/91/32/20224832.jpg" },
        { id: 4, name: "UM FINAL ALUCINANTE! - PROJECT ZOMBOID", description: "MELHOR LIVE EM GRUPO", img: "https://i.ytimg.com/vi/nXUuo88npk0/maxresdefault.jpg" },
        { id: 5, name: "COMO SE TORNAR UM SPOOKTUBER DE SUCESSO! - CONTENT WARNING", description: "MELHOR LIVE EM GRUPO", img: "https://i.ytimg.com/vi/QTz3ZhnVGUA/maxresdefault.jpg" },
        { id: 6, name: "BATMAN: ARKHAM KNIGHT", description: "MELHOR JOGO", img: "https://cdn2.unrealengine.com/Diesel%2Fproductv2%2Fbatman-arkham-knight%2FEGS_WB_Batman_Arkham_Knight_G1_1920x1080_19_0911-1920x1080-1d69e15f00cb5ab57249f208f1f8f45d52cbbc59.jpg" },
    ];

    const indicados = [
        { 
            id: 0, 
            categoria: "Melhor filme lançado no ano", 
            description: "Reconhecendo o filme mais marcante do ano, com destaque para narrativa e atuações.",
            nomeados: [
                { id: 0, winner:false, name: "DEADPOOL & WOLVERINE", description: "SHAWN LEVY", img: "https://upload.wikimedia.org/wikipedia/pt/2/2a/Deadpool_%26_Wolverine_cartaz.jpg" },
                { id: 1, winner:false, name: "O DUBLE", description: "DAVID LEITCH", img: "https://static.wixstatic.com/media/84e632_9111fdf89c5b4210845478d23ba44554~mv2.jpg/v1/fill/w_980,h_1551,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/84e632_9111fdf89c5b4210845478d23ba44554~mv2.jpg" },
                { id: 2, winner:true, name: "KUNG FU PANDA 4", description: "MIKE MITCHELL", img: "https://dx35vtwkllhj9.cloudfront.net/universalstudios/kung-fu-panda-4/images/regions/us/onesheet.jpg" },
                { id: 3, winner:false, name: "GARRA DE FERRO", description: "SEAN DURKIN", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
                { id: 4, winner:false, name: "SONIC 3", description: "JEFF FOWLER", img: "https://resizing.flixster.com/stIwab1KImKTQYXoxKDSpXjsLAc=/206x305/v2/https://resizing.flixster.com/5yCDU3YndW2EIWaEwH1FydaMwZI=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2E0MGM5YTk5LTdhY2UtNGYzNS04NGVmLTJlNjRkYjljNjQ4ZS5qcGc=" },
            ] 
        },
        { 
            id: 1, 
            categoria: "Melhor live em grupo", 
            nomeados: [
                { id: 0, winner:false, name: "O PIOR MECÂNICO DOS MARES!", description: "BARONTRAUMA", img: "https://i.ytimg.com/vi/xPQs7EW0AAw/maxresdefault.jpg" },
                { id: 1, winner:false, name: "OS INCOMPETENTES VOLTARAM", description: "LETHAL COMPANY", img: "https://i.ytimg.com/vi/NUl026Y4VHM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBb8c19xYhbYwFnrKuE8r6verbHpg" },
                { id: 2, winner:false, name: "MARIO PARTY VOLTOU! - MARIO PARTY: JAMBOREE COM OS INIMIGOS", description: "MARIO PARTY: JAMBOREE", img: "https://i.ytimg.com/vi/60BP7rh0HT8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAW2ouV5yutEi2PLBPvG8-5Z3NBxQ" },
                { id: 3, winner:false, name: "ESSE JOGO FEZ EU ODIAR MEUS AMIGOS!", description: "PICO PARK 2", img: "https://i.ytimg.com/vi/sZ6eTrkfOEc/maxresdefault.jpg" },
                { id: 4, winner:false, name: "O MAIOR MENTIROSO DO JOGO!", description: "LOCKDOWN PROTOCOL", img: "https://i.ytimg.com/vi/fK4mn_NueTo/maxresdefault.jpg" },
                { id: 5, winner:false, name: "LETHAL COMPANY NAS PROFUNDEZAS?", description: "MURKY DIVERS", img: "https://i.ytimg.com/vi/e9GOcDPK2Do/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC9RBv7CM_Z_ikRp3oaxqzpxr69CA" }
            ] 
        },
        { 
            id: 2, 
            categoria: "Melhor série", 
            nomeados: [
                { id: 0, winner:false, name: "FALLOUT", description: "1ª TEMPORADA", img: "https://resizing.flixster.com/ePgDla2nOK-2GQAxzuA11UkvhgQ=/206x305/v2/https://resizing.flixster.com/7QgV-TZ9q2kTGMrubJkFuQOLzSM=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvNzc1NWE1ODAtNTliZS00YTgyLWJmMDAtMjcyMDlmMzQzNjgwLmpwZw==" },
                { id: 1, winner:false, name: "ROUND 6", description: "2ª TEMPORADA", img: "https://resizing.flixster.com/wgzK12s6HU9tTH0ChP_5eGy4c3Y=/206x305/v2/https://resizing.flixster.com/csfX8Ezg8smfPo1IBliNxACEJCA=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vZGFkOGYxYjgtZDU0ZS00OGIwLTk1NjktMmNjNzA1YTdkNjBiLmpwZw==" },
                { id: 2, winner:false, name: "ARCANE", description: "2ª TEMPORADA", img: "https://resizing.flixster.com/jAlNgPqSQHpxH6ju0Eis-j8cdWE=/206x305/v2/https://resizing.flixster.com/dIDB54V_MjguvAiEPfYlB3_cYfg=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vYjExOWI4M2UtZjhiMS00MWUxLWJhN2QtNjMzNjk1ZjFlYjc0LmpwZw==" },
                { id: 3, winner:false, name: "COBRA KAI", description: "5ª TEMPORADA", img: "https://resizing.flixster.com/eDaSH-F_M8o9Tg7NpFQzjFNyKuQ=/206x305/v2/https://resizing.flixster.com/Z-kHbJr9r5PLceKAxepwdo1ScGk=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvNTg0MWE3M2MtNjI0Ny00NmY3LThlOWUtNWYwNjU2ODE0ZjA4LmpwZw==" },
                { id: 4, winner:false, name: "SENNA", description: "1ª TEMPORADA", img: "https://resizing.flixster.com/lb5LPUnkN4bphWk82QPPVwHkbh4=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p28706525_b_v8_ac.jpg" }
            ] 
        },
        { 
            id: 3, 
            categoria: "Melhor jogo", 
            nomeados: [
                { id: 0, winner:false, name: "GOD OF WAR: RAGNAROK", description: "SANTA MONICA STUDIO", img: "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/aqZdSwWyy9JcQ66BxHDKrky6.jpg" },
                { id: 1, winner:false, name: "RED DEAD REDEMPTION 2", description: "ROCKSTAR GAMES", img: "https://store-images.s-microsoft.com/image/apps.58752.13942869738016799.078aba97-2f28-440f-97b6-b852e1af307a.95fdf1a1-efd6-4938-8100-8abae91695d6?q=90&w=480&h=270" },
                { id: 2, winner:false, name: "ELDEN RING", description: "FROMSOFTWARE", img: "https://store-images.s-microsoft.com/image/apps.30323.14537704372270848.6ecb6038-5426-409a-8660-158d1eb64fb0.08703491-f5dc-4b00-bca6-486b7b293c17?q=90&w=480&h=270" },
                { id: 3, winner:false, name: "ORI THE WILL OF THE WISPS", description: "MOON STUDIOS", img: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000034725/cf74916275780188fd850512efe6c678318d7317bf987599205d2a3fc76dbd79" },
                
            ]  
        },
        { 
            id: 4, 
            categoria: "Melhor live", 
            nomeados: [
                { id: 0, winner:false, name: "UM CARTEADO DIFERENTE!", description: "BALATRO", img: "https://i.ytimg.com/vi/iUGEa2clFU4/maxresdefault.jpg" },
                { id: 1, winner:false, name: "FUGINDO DE UMA FREIRA", description: "EVIL NUN: THE BROKEN MASK", img: "https://i.ytimg.com/vi/xRB6viNqGx8/maxresdefault.jpg" },
                { id: 2, winner:false, name: "ALANZOKA JOGANDO PALWORLD", description: "PALWOLRD", img: "https://i.ytimg.com/vi/B24Ql0-Ro7I/maxresdefault.jpg" },
                { id: 3, winner:false, name: "NUNCA MAIS VOU TIRAR FÉRIAS!", description: "FEARS TO FATHOM: WOODBURY GETAWAY", img: "https://i.ytimg.com/vi/mGKK7reepug/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAZ8GR5cC5lXjMsUwtfzyV-MJO7TA" },
                { id: 4, winner:false, name: "ALANZOKA JOGANDO MORTISOMEM", description: "MORTISOMEM", img: "https://i.ytimg.com/vi/EUWSfn-N6fc/maxresdefault.jpg" }
            ]  
        },
        { 
            id: 5, 
            categoria: "Melhor filme", 
            nomeados: [
                { id: 0, winner:false, name: "007: CONTRA SPECTRE", description: "sAM MENDES", img: "https://resizing.flixster.com/vnqt1aYlFry31bnplnjiYD63zgM=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p11268880_p_v13_as.jpg" },
                { id: 1, winner:false, name: "SONIC 3", description: "JEFF FOWLER", img: "https://resizing.flixster.com/stIwab1KImKTQYXoxKDSpXjsLAc=/206x305/v2/https://resizing.flixster.com/5yCDU3YndW2EIWaEwH1FydaMwZI=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2E0MGM5YTk5LTdhY2UtNGYzNS04NGVmLTJlNjRkYjljNjQ4ZS5qcGc=" },
                { id: 2, winner:false, name: "o SENHOR DOS ANÉIS: O RETORNO DO REI", description: "PETER JACKSON", img: "https://upload.wikimedia.org/wikipedia/pt/0/0d/EsdlaIII.jpg" },
                { id: 3, winner:false, name: "HOBBIT: A DESOLAÇÃO DE SMAUG", description: "PETER JACKSON", img: "https://br.web.img3.acsta.net/pictures/210/571/21057125_20131112201221324.jpg" },
                { id: 4, winner:false, name: "GARRA DE FERRO", description: "SEAN DURKIN", img: "https://media.fstatic.com/LZAm_FvsgJkSvnrWOPJdhSS80dA=/322x478/smart/filters:format(webp)/media/movies/covers/2024/02/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQX_g8m36XN.jpg" },
            ] 
        }, 
    ];
    


    const value = {
        votes,
        saveVote,
        indicados,
        shortlisted,
        menuOpen, 
        setMenuOpen,
        targetDate,
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