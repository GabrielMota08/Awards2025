import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import winner_background from "../assets/winner_background.png"
import { MdSwapHoriz } from "react-icons/md";
import "./nomineesCard.modules.css";
import AppContext from "../context/AppContext";

const NomineesCard = ({content, numericId}) => {
    const { saveVote, votes } = useContext(AppContext);
     const handleVote = (voteId) => {
        saveVote(numericId, voteId);
        //console.log(`Voto salvo para o indicado ${numericId}:`, voteId);
    };
    
    return (
        <div className={`nomineesCardDiv ${votes[numericId] === undefined ? "" : votes[numericId] !== content.name ? "unVoteDiv" : "marginBottom5em"}`}>
        <li
            className={"nomineesCard" }
            key={content.name}
        >
            <img
                src={content.img}
                alt={content.name}
                onLoad={(e) => {
                    const img = e.target;
                    const parent = img.parentNode;
                    parent.classList.remove("nomineesCardA", "nomineesCardB");
                    if (img.naturalWidth > img.naturalHeight) {
                        parent.classList.add("nomineesCardB");
                    } else {
                        parent.classList.add("nomineesCardA");
                    }
                }}
            />
            <img className="winner_background" src={winner_background} alt="Background" />
            <button 
                onClick={() => handleVote(content.name)}
                className={`voteButton ${
                    votes[numericId] === undefined
                    ? "vote"
                    : votes[numericId] !== content.name
                    ? "unVote"
                    : "votado"}`
                }
                disabled={votes[numericId] !== undefined}
            >
                <span>
                {votes[numericId] === undefined
                    ? "VOTE"
                    : votes[numericId] !== content.name
                    ? "VOTE" 
                    : "VOTADO"
                }
                </span>
            </button>
            <h2>{content.name}</h2>
            <p>{content.description}</p>
            {/* <svg width="100" height="100">
                <circle cx="50" cy="50" r="40" stroke="#8F9BFF" strokeWidth="2" strokeDasharray="10,5" fill="transparent" />
            </svg> */}
            <button onClick={() => handleVote(undefined)} className={`exchangeButton ${votes[numericId] === content.name && "exchangeButtonVisible"}`}>TROCAR VOTO <MdSwapHoriz /></button>
        </li>
        </div>
    );
};

NomineesCard.propTypes = {
    content: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        img: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    numericId: PropTypes.number.isRequired,
    showLink: PropTypes.bool
};

export default NomineesCard;
