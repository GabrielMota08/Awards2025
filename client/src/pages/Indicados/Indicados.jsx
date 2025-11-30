import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import api from "../../services/api"; 
import AppContext from "../../context/AppContext";
import NomineesCard from "../../components/nomineesCard";
import ResultsCard from "../../components/resultsCard"; 
import "./Indicados.modules.css";

const Indicados = () => {
    const { token, id } = useParams(); 
    const navigate = useNavigate();
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Agora pegamos também o saveVote para atualizar a UI
    const { user, targetDate, saveVote } = useContext(AppContext); 
    
    const [lowOpacity, setLowOpacity] = useState(0);
    const categoryIndex = Number(id); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/vote-data/${token}`);
                setGroupData(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        if (!groupData) return;
        const totalCategories = groupData.categories.length;
        if (categoryIndex === 0) setLowOpacity(1); 
        else if (categoryIndex === totalCategories - 1) setLowOpacity(2);
        else setLowOpacity(0);
    }, [categoryIndex, groupData]);

    const navigateTo = (direction) => {
        if (!groupData) return;
        const nextIndex = direction === "prev" ? categoryIndex - 1 : categoryIndex + 1;
        if (nextIndex >= 0 && nextIndex < groupData.categories.length) {
            navigate(`/nominees/${token}/${nextIndex}`);
        }
    };

    // Função ajustada: recebe ID e NOME para atualizar interface
    const handleVote = async (nomineeId, nomineeName) => {
        if (!user) {
            alert("Faça login para votar.");
            navigate('/auth');
            return;
        }
        
        const realCategoryId = groupData.categories[categoryIndex].id;
        const realGroupId = groupData.group.id;

        try {
            await api.post("/vote", {
                groupId: realGroupId,
                categoryId: realCategoryId,
                nomineeId: nomineeId
            });
            
            // ATUALIZA O ESTADO LOCAL PARA O BOTÃO FICAR VERDE
            saveVote(realCategoryId, nomineeName); 
            
            alert("Voto computado! ✅");
        } catch (err) {
            alert(err.response?.data?.msg || "Erro ao votar.");
        }
    };

    if (loading) return <div style={{color:'white', padding:'20px'}}>Carregando...</div>;
    if (!groupData || !groupData.categories[categoryIndex]) {
        return <div style={{color:'white', padding:'20px'}}>Categoria inválida.</div>;
    }

    const currentCategory = groupData.categories[categoryIndex];
    const nomeados = currentCategory.nominees; 

    return (
        <div className="indicados-container">
            <div className="categoriesNominees">
                <Link to="/" className="backToHome"><FaArrowLeftLong /> PÁGINA INICIAL</Link>
                <section className="categoriesNomineesSection">
                    <div className={` ${lowOpacity === 1 ? "lowOpacity " : "setaAnterior"}`} onClick={() => navigateTo("prev")}>
                        <MdArrowBackIosNew />
                        <p>Anterior</p>
                    </div>
                    <Link to={`/categories/${token}`}>VER CATEGORIAS</Link>
                    <div className={` ${lowOpacity === 2 ? "lowOpacity" : "setaProximo"}`} onClick={() => navigateTo("next")}>
                        <p>Próximo</p>
                        <MdArrowForwardIos />
                    </div>
                </section>
                <div className="votesCast">Categoria {categoryIndex + 1}/{groupData.categories.length}</div>
            </div>
            
            <section className="indicadosSection">   
                <div className="categorieTitle"><h1>{currentCategory.name}</h1></div>
                <h2>{currentCategory.description}</h2>
                <ul>
                    {new Date() < new Date(targetDate)
                        ? nomeados.map((nominee, index) => (
                            <li key={nominee.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                <NomineesCard 
                                    content={{
                                        name: nominee.name,
                                        description: nominee.description,
                                        img: nominee.image
                                    }}
                                    // AQUI ESTAVA O ERRO: Adicionada a prop numericId
                                    numericId={currentCategory.id} 
                                    onVote={() => handleVote(nominee.id, nominee.name)}
                                />
                            </li>
                        )) 
                        : nomeados.map((nominee, index) => (
                            <li key={nominee.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                <ResultsCard content={nominee} winner={nominee.winner} />
                            </li>
                        ))}
                </ul>   
            </section>
        </div>
    );
};

export default Indicados;