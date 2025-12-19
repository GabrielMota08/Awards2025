import React, { useContext, useEffect, useState } from "react";
import api from "../../services/api"; 
import AppContext from "../../context/AppContext";
import styles from "./Categoria.module.css";
import { Link, useParams } from "react-router-dom";

const Categoria = () => {
    const { token } = useParams()
    const [categories, setCategories] = useState([]);
    const [group, setGroup] = useState([]);
    const [loading, setLoading] = useState(true);
    const {themeBg} = useContext(AppContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/vote-data/${token}`);
                setGroup(response.data.group)
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Erro ao buscar dados", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    return (   
        <>
        <section className={`${styles.categories} ${styles[`categories${themeBg || "Purple"}`]}`}>
            <h1>TODAS AS CATEGORIAS</h1>
            <div>
            <h2><span>INDICADOS</span>{group.title}</h2>
            {loading ? 
                <h4 style={{marginLeft: "20px"}}>Carregando...</h4>
            : (categories.length > 0) 
            ?   <p className={styles[`categoriesCard${themeBg || "Purple"}`]}>
                    {categories.map(({ id, name }, index) => (
                        <Link to={`/nominees/${token}/${index}`} key={id}>
                            {name}
                        </Link>
                    ))}
                </p>
            : <h4 style={{marginLeft: "20px"}}>Votação não encontrada</h4>}
            </div>
        </section>
        </>
    );
};

export default Categoria;
