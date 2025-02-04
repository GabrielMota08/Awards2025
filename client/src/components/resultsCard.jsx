import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import winner_background from "../assets/winner_background.svg"
import winner_background_larger from "../assets/winner_background_larger.svg"
import "./ResultsCard.modules.css";
import AppContext from "../context/AppContext";

const ResultsCard = ({content, numericId, winner}) => {
    const { votes } = useContext(AppContext);
    const [ winnerBackgroundLarger, setWinnerBackgroundLarger ]  = useState(false);
    
    return (
        <div className={`resultsCardDiv ${winner ? "winnerCard" : "voteExpiredDiv"}`}> 
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
                        setWinnerBackgroundLarger(true)
                    } else {
                        parent.classList.add("nomineesCardA");
                        setWinnerBackgroundLarger(false)
                    }
                }}
            />
            {winner && (winnerBackgroundLarger ? <img className="winner_background" src={winner_background_larger} alt="Background" /> : <img className="winner_background" src={winner_background} alt="Background" />)}
            
            <button 
                className={`voteButton ${
                    winner ? "vencedor" : "voteExpired"}`
                }
                disabled={votes[numericId] !== undefined}
            >
                <span>
                {winner ? "VENCEDOR" : "VOTAÇÃO ENCERRADA"}
                </span>
            </button>
            <h2>{content.name}</h2>
            <p>{content.description}</p>
        </li>
        </div>
    );
};

ResultsCard.propTypes = {
    content: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        img: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        winner: PropTypes.bool.isRequired,
    }).isRequired,
    numericId: PropTypes.number.isRequired,
    showLink: PropTypes.bool
};

export default ResultsCard;
