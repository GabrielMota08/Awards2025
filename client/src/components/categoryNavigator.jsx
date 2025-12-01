import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./categoryNavigator.module.css"
import { FaArrowLeftLong } from "react-icons/fa6";

const CategoryNavigator = ({ lowOpacity, navigateTo, token, categoryProgress }) => {
    return (
        <div className={styles.categoriesNominees}>
            <Link to="/" className={styles.backToHome}>
                <FaArrowLeftLong /> PÁGINA INICIAL
            </Link>
            <section className={styles.categoriesNomineesSection}>
                <div 
                    className={
                        lowOpacity === 1 
                        ? styles.lowOpacity 
                        : styles.setaAnterior
                    }
                    onClick={() => navigateTo("prev")}
                >
                    <MdArrowBackIosNew />
                    <p>Anterior</p>
                </div>

                <Link to={`/categories/${token}`}>VER CATEGORIAS</Link>

                <div 
                    className={
                        lowOpacity === 2 
                        ? styles.lowOpacity 
                        : styles.setaProximo
                    }
                    onClick={() => navigateTo("next")}
                >
                    <p>Próximo</p>
                    <MdArrowForwardIos />
                </div>
            </section>
            <div className={styles.votesCast}>
                {categoryProgress}
            </div>
        </div>
    )
}

export default CategoryNavigator;