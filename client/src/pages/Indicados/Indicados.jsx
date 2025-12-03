import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import api from "../../services/api"; 
import AppContext from "../../context/AppContext";
import NomineesCard from "../../components/nomineesCard";
import ResultsCard from "../../components/resultsCard"; 
import styles from "./Indicados.module.css";
import CategoryNavigator from "../../components/categoryNavigator";

const Indicados = () => {
    const { token, id } = useParams(); 
    const navigate = useNavigate();
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const { user, targetDate, saveVote, setTargetDate, fetchUserVotes } = useContext(AppContext); 
    
    const [lowOpacity, setLowOpacity] = useState(0);
    const categoryIndex = Number(id); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/vote-data/${token}`);
                setGroupData(response.data);

                if (response.data.group) {
                    if (response.data.group.end_date) {
                        setTargetDate(new Date(response.data.group.end_date));
                    }
                
                    if (user) {
                        fetchUserVotes(response.data.group.id);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, user]);

    useEffect(() => {
        if (!groupData) return;
        const total = groupData.categories.length;
        if (categoryIndex === 0) setLowOpacity(1);
        else if (categoryIndex === total - 1) setLowOpacity(2);
        else setLowOpacity(0);
    }, [categoryIndex, groupData]);

    const navigateTo = (direction) => {
        if (!groupData) return;
        const next = direction === "prev" ? categoryIndex - 1 : categoryIndex + 1;
        if (next >= 0 && next < groupData.categories.length) {
            navigate(`/nominees/${token}/${next}`);
        }
    };

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

            saveVote(realCategoryId, nomineeName);

        } catch (err) {
            alert(err.response?.data?.msg || "Erro ao votar.");
        }
    
    };
    
    const handleDeleteVote = async (categoryId) => {
        if (!user) {
            alert("Faça login para remover o voto.");
            navigate('/auth');
            return;
        }

        const realGroupId = groupData.group.id;

        try {
            await api.delete("/vote", {
                data: { 
                    groupId: realGroupId, 
                    categoryId 
                }
            });

            saveVote(categoryId, undefined);

        } catch (err) {
            alert(err.response?.data?.msg || "Erro ao remover voto.");
        }
    };


    if (loading) return <div style={{color:'white', padding:'20px'}}>Carregando...</div>;
    if (!groupData || !groupData.categories[categoryIndex]) {
        return <div style={{color:'white', padding:'20px'}}>Categoria inválida.</div>;
    }

    const currentCategory = groupData.categories[categoryIndex];
    const nomeados = currentCategory.nominees; 

    return (
        <div className={styles.indicadosContainer}>
            
            <CategoryNavigator lowOpacity={lowOpacity} navigateTo={navigateTo} token={token} categoryProgress={`${categoryIndex + 1}/${groupData.categories.length}`}/>
            
            <section className={styles.indicadosSection}>   
                <div className={styles.categorieTitle}>
                    <h1>{currentCategory.name}</h1>
                </div>

                <h2>{currentCategory.description}</h2>

                <ul>
                    {new Date() < new Date(targetDate) ? (
                        nomeados.map((nominee, index) => (
                            <li key={nominee.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                <NomineesCard 
                                    content={{
                                        name: nominee.name,
                                        description: nominee.description,
                                        img: nominee.image
                                    }}
                                    numericId={currentCategory.id}
                                    onDeleteVote={() => handleDeleteVote(currentCategory.id)}
                                    onVote={() => handleVote(nominee.id, nominee.name)}
                                />
                            </li>
                        ))
                    ) : (
                        nomeados.map((nominee, index) => (
                            <li key={nominee.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                <ResultsCard content={nominee} winner={nominee.winner} />
                            </li>
                        ))
                    )}
                </ul>   
            </section>

        </div>
    );
};

export default Indicados;
