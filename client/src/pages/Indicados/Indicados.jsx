import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Indicados.modules.css";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import NomineesCard from "../../components/nomineesCard";
import { FaArrowLeftLong } from "react-icons/fa6";
import ResultsCard from "../../components/resultsCard";

const Indicados = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { indicados, votes, targetDate } = useContext(AppContext);
    const [lowOpacity, setLowOpacity] = useState(0);
    const numericId = Number(id); // Converte id para número
    const indicado = indicados.find((item) => item.id === numericId);
    if (!indicado) {
        return <div>Indicado não encontrado!</div>;
    }

    const nomeados = indicado.nomeados;

    useEffect(() => {
        if (numericId === 0) {
            setLowOpacity(1);
        } else if (numericId === indicados.length - 1) {
            setLowOpacity(2);
        } else {
            setLowOpacity(0);
        }
    }, [numericId, indicados.length]);


    const navigateTo = (direction) => {
        const nextId = direction === "prev" ? numericId - 1 : numericId + 1;
        if (nextId >= 0 && nextId < indicados.length) {
            navigate(`/nominees/${nextId}`);
        }
        //console.log("mudou")
    };

    return (
        <div className="indicados-container">
            <div className="categoriesNominees">
                <Link to="/" className="backToHome"><FaArrowLeftLong /> PÁGINA INICIAL</Link>
                <section className="categoriesNomineesSection">
                <div className={` ${lowOpacity === 1 ? "lowOpacity " : "setaAnterior"}`} onClick={() => navigateTo("prev")}>
                    <MdArrowBackIosNew />
                    <p>
                        Anterior
                    </p>
                </div>
                <Link to="/categories">VER CATEGORIAS</Link>
                <div className={` ${lowOpacity === 2 ? "lowOpacity" : "setaProximo"}`} onClick={() => navigateTo("next")}>
                    <p>
                        Próximo
                    </p>
                    <MdArrowForwardIos />
                </div>
                </section>
                <div className="votesCast"> {Object.values(votes).filter(vote => vote !== undefined && vote !== null).length}/{indicados.length}</div>

                
            </div>
            
            <section className="indicadosSection">   
                <div className="categorieTitle">
                    <h1>{indicado.categoria}</h1>
                    {/* <button className="finishButton">Finalizar votação</button> */}
                </div>
            <h2>{indicado.description}</h2>
            <ul>
                {new Date() < targetDate
                    ? nomeados.map((indicados, index) => (
                        <li key={indicados.id} style={{ animationDelay: `${index * 0.1}s` }}>
                            <NomineesCard key={indicados.id} content={indicados} numericId={numericId} winner={false}/>
                        </li>
                    )) 
                    : nomeados.map((indicados, index) => (
                        <li key={indicados.id} style={{ animationDelay: `${index * 0.1}s` }}>
                            <ResultsCard key={indicados.id} content={indicados} numericId={numericId} winner={indicados.winner}/>
                        </li>
                    ))}
            </ul>   
            </section>
            
        </div>
    );
};

export default Indicados;
