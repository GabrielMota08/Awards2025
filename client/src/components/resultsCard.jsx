import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import winner_background from "../assets/winner_background.svg";
import winner_background_larger from "../assets/winner_background_larger.svg";
import styles from "./resultsCard.module.css";
import AppContext from "../context/AppContext";

const ResultsCard = ({ content, numericId, winner }) => {
    const { votes } = useContext(AppContext);
    const [winnerBackgroundLarger, setWinnerBackgroundLarger] = useState(false);

    return (
        <div 
            className={`${styles.resultsCardDiv} ${
                winner ? styles.winnerCard : styles.voteExpiredDiv
            }`}
        >
            <li // Obs: Certifique-se que o pai deste componente seja um <ul>
                className={styles.nomineesCard}
                key={content.name}
            >
                {/* Imagem Principal */}
                <img
                    src={content.image} // Verifique se o objeto traz 'image' ou 'img'
                    alt={content.name}
                    className={styles.imgNomineesCard}
                    onLoad={(e) => {
                        const img = e.target;
                        const parent = img.parentNode;
                        
                        parent.classList.remove(styles.nomineesCardA, styles.nomineesCardB);

                        if (img.naturalWidth > img.naturalHeight) {
                            parent.classList.add(styles.nomineesCardB);
                            setWinnerBackgroundLarger(true);
                        } else {
                            parent.classList.add(styles.nomineesCardA);
                            setWinnerBackgroundLarger(false);
                        }
                    }}
                />

                {/* --- CORREÇÃO AQUI --- */}
                {winner && (
                    winnerBackgroundLarger 
                        ? <img className={styles.winnerBackground} src={winner_background_larger} alt="Background" /> 
                        : <img className={styles.winnerBackground} src={winner_background} alt="Background" />
                )}
                {/* --------------------- */}
                
                <button 
                    className={`${styles.voteButton} ${
                        winner ? styles.vencedor : styles.voteExpired
                    }`}
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
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    numericId: PropTypes.number.isRequired,
    showLink: PropTypes.bool,
    winner: PropTypes.bool,
};

export default ResultsCard;