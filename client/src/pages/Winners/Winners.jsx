import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import api from "../../services/api";
import AppContext from "../../context/AppContext";
import ResultsCard from "../../components/resultsCard";
import styles from "./Winners.module.css";
import CategoryNavigator from "../../components/categoryNavigator";

const Winners = () => {
    const { token, id } = useParams(); // token da URL
    const navigate = useNavigate();
    const { votes } = useContext(AppContext);

    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lowOpacity, setLowOpacity] = useState(0);
    const categoryIndex = Number(id);

    // BUSCAR DADOS DA API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/vote-data/${token}`);
                setGroupData(response.data);
            } catch (err) {
                console.error("Erro ao buscar dados", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    // CONTROLAR OPACIDADE DAS SETAS
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
            navigate(`/winners/${token}/${next}`);
        }
    };

    if (loading) return <div style={{ color: "white", padding: "20px" }}>Carregando...</div>;
    if (!groupData || !groupData.categories[categoryIndex]) {
        return <div style={{ color: "white", padding: "20px" }}>Categoria inválida.</div>;
    }

    const currentCategory = groupData.categories[categoryIndex];
    const nomeados = currentCategory.nominees;

    return (
        <div className={styles.indicadosContainer}>
            <CategoryNavigator
                lowOpacity={lowOpacity}
                navigateTo={navigateTo}
                token={token}
                categoryProgress={`${categoryIndex + 1}/${groupData.categories.length}`}
            />

            <section className={styles.indicadosSection}>
                <div className={styles.categorieTitle}>
                    <h1>{currentCategory.name}</h1>
                </div>

                <h2>{currentCategory.description}</h2>

                <ul>
                    {nomeados.map((item, index) => (
                        <li key={item.id} style={{ animationDelay: `${index * 0.1}s` }}>
                            <ResultsCard
                                content={item}
                                numericId={categoryIndex}
                                winner={item.winner}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Winners;
