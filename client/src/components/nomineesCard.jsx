import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import winner_background from "../assets/winner_background.svg"
import winner_background_larger from "../assets/winner_background_larger.svg"
import { MdSwapHoriz } from "react-icons/md";
import "./nomineesCard.modules.css";
import AppContext from "../context/AppContext";

// Adicionada a prop 'onVote' para receber a função da API
const NomineesCard = ({content, numericId, winner, onVote}) => {
    // Removemos 'saveVote' daqui, pois quem salva agora é a API no pai
    const { votes } = useContext(AppContext); 
    const [ winnerBackgroundLarger, setWinnerBackgroundLarger ]  = useState(false);

    // Função simplificada para acionar o voto vindo do pai
    const handleVote = () => {
        if (onVote) {
            onVote(); 
        }
    };
    
    // Lógica para verificar se este card específico é o que foi votado
    // (Isso mantém o visual de "selecionado" funcionando se o votes estiver atualizado)
    const isSelected = votes[numericId] === content.name;
    const hasVotedInCategory = votes[numericId] !== undefined;

    return (
        <div className={`nomineesCardDiv ${!hasVotedInCategory ? "" : !isSelected ? "unVoteDiv" : "marginBottom5em"}`}>
        <li
            className={"nomineesCard" }
            key={content.name}
        >
            <img
                src={content.img} // Certifique-se que o backend manda 'img' ou 'image_url' e ajuste se necessário
                alt={content.name}
                className="imgNomineesCard"
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
            
            <button 
                onClick={handleVote}
                className={`voteButton ${
                    !hasVotedInCategory
                    ? "vote"
                    : !isSelected
                    ? "unVote"
                    : "votado"}`
                }
                // Se já votou (em qualquer um), desabilita os outros botões, exceto se quiser lógica de troca
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
            
            {/* Botão de Trocar Voto: Só aparece se este for o card selecionado */}
            {/* Nota: A lógica de trocar voto no backend exigiria um DELETE ou UPDATE. 
                Por enquanto, isso apenas re-habilita visualmente se o contexto for limpo. */}
            <button 
                onClick={() => console.log("Lógica de trocar voto deve ser implementada no backend/pai")} 
                className={`exchangeButton ${isSelected && "exchangeButtonVisible"}`}
            >
                TROCAR VOTO <MdSwapHoriz />
            </button>
        </li>
        </div>
    );
};

NomineesCard.propTypes = {
    content: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        img: PropTypes.string, // Ajuste conforme seu backend (image_url ou img)
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
    }).isRequired,
    numericId: PropTypes.number.isRequired,
    showLink: PropTypes.bool,
    onVote: PropTypes.func.isRequired // Nova validação
};

export default NomineesCard;