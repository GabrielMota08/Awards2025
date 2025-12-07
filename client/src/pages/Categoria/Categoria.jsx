import React, { useContext, useEffect, useState } from "react";
import api from "../../services/api"; 
import AppContext from "../../context/AppContext";
import styles from "./Categoria.module.css";
import { Link, useParams } from "react-router-dom";

const Categoria = () => {
    const { token } = useParams()
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/vote-data/${token}`);
                setCategories(response.data.categories);
                console.log(response.data.categories)
            } catch (error) {
                console.error("Erro ao buscar dados", error);
            } finally {
                // setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    return (   
        <>
        <section className={styles.categories}>
            <h1>TODAS AS CATEGORIAS</h1>
            <div>
            <h2><span>INDICADOS</span></h2>
            {categories.length > 0 ?
                <p>
                    {categories.map(({ id, name }, index) => (
                        <Link to={`/nominees/${token}/${index}`} key={id}>
                        {name}
                        </Link>
                    ))}
                </p>
            : <h4 style={{marginLeft: "20px"}}>Carregando...</h4>}
            </div>
        </section>
        </>
    );
};

export default Categoria;
