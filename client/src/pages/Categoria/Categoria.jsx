import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import "./Categoria.modules.css";
import { Link } from "react-router-dom";

const Categoria = () => {
    const { indicados } = useContext(AppContext);

    return (   
        <>
        <section className="categories">
            <h1>TODAS AS CATEGORIAS</h1>
            <div>
            <h2><span>INDICADOS</span> 2024</h2>
                <p>{indicados.map((indicado) => (<Link to={`/nominees/${indicado.id}`} key={indicado.id}>{indicado.categoria}</Link>))}</p>
            </div>
        </section>
        </>
    );
};

export default Categoria;
