import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import winner_background from "../assets/winner_background.svg"
import winner_background_larger from "../assets/winner_background_larger.svg"
import { MdSwapHoriz } from "react-icons/md";
import styles from "./nomineesCard.module.css";
import AppContext from "../context/AppContext";

const NomineesCard = ({ content, numericId, onVote, onDeleteVote }) => {
    const { votes } = useContext(AppContext); 
    const [winnerBackgroundLarger, setWinnerBackgroundLarger]  = useState(false);

    const handleVote = () => {
        if (onVote) onVote();
    };

    const isSelected = votes[numericId] === content.name;
    const hasVotedInCategory = votes[numericId] !== undefined;

    return (
        <div 
            className={
                `${styles.nomineesCardDiv} ` +
                `${!hasVotedInCategory ? "" : !isSelected ? styles.unVoteDiv : styles.marginBottom5em}`
            }
        >
            {/* Alterado de li para div */}
            <div
                className={styles.nomineesCard}
                key={content.name}
            >
                <img
                    src={content.img}
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
                
                <button 
                    onClick={!isSelected ? handleVote : undefined}
                    className={
                        `${styles.voteButton} ` + 
                        `${
                            !hasVotedInCategory
                            ? styles.vote
                            : !isSelected
                            ? styles.unVote
                            : styles.votado
                        }`
                    }
                    disabled={hasVotedInCategory && !isSelected} 
                >
                    <span>
                    {!hasVotedInCategory
                        ? "VOTE"
                        : !isSelected
                        ? "VOTE" 
                        : "VOTADO"
                    }
                    </span>
                </button>

                <h2>{content.name}</h2>
                <p>{content.description}</p>

                <button 
                    onClick={onDeleteVote} 
                    className={`${styles.exchangeButton} ${isSelected ? styles.exchangeButtonVisible : ""}`}
                >
                    TROCAR VOTO <MdSwapHoriz />
                </button>
            </div>
        </div>
    );
};

NomineesCard.propTypes = {
    content: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        img: PropTypes.string,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
    }).isRequired,
    numericId: PropTypes.number.isRequired,
    showLink: PropTypes.bool,
    onVote: PropTypes.func.isRequired,
    onDeleteVote: PropTypes.func.isRequired
};

export default NomineesCard;