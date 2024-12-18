import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
const imageUrl = import.meta.env.VITE_IMG;
import "./MovieCard.modules.css";
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded, MdOutlineBookmarkRemove } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import Axios from "axios";
import AppContext from "../context/AppContext";

const MovieCard = ({ movie, showLink = true }) => {
    const [isFavorite, setFavorite] = useState(false);
    const [isHovered, setHovered] = useState(false);
    const { watchListMovies } = useContext(AppContext);
    const navigate = useNavigate();

    const favoriteFilm = () => {
        setFavorite(!isFavorite);
        if (!isFavorite) {
            addToWatchlist(movie.id);
        } else {
            removeToWatchlist(movie.id);
        }
    };

    useEffect(() => {
        setFavorite(watchListMovies.some(e => e === movie.id));
    }, [watchListMovies, movie.id]);

    const addToWatchlist = async (movieId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Usuário não autenticado. Redirecionando para autenticação.");
            navigate("/auth");
            return;
        }

        try {
            const response = await Axios.post("http://localhost:3001/watchlist", {
                movieId: movieId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.msg);
        } catch (error) {
            console.error("Erro ao adicionar filme à watchlist:", error);
        }
    };

    const removeToWatchlist = async (movieId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("Usuário não autenticado. Redirecionando para autenticação.");
            navigate("/auth");
            return;
        }

        try {
            const response = await Axios.put(`http://localhost:3001/watchlist/${movieId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.msg);
        } catch (error) {
            console.error("Erro ao remover filme da watchlist:", error);
        }
    };

    return (
        <div className="movie-card">
            <Link to={`/movie/${movie.id}`}>
                <img src={imageUrl + movie.poster_path} alt={movie.title} />
            </Link>
            <div className={`${!isFavorite && "button-backgroundNone"} button-background` } />
            <button
                className={`${isFavorite ? "color" : "noColor"} ${isHovered ? "hover" : "nohover"}`}
                onClick={favoriteFilm}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {isFavorite && isHovered ? (
                    <MdOutlineBookmarkRemove />
                ) : (
                    <MdOutlineBookmarkAdded />
                )}
            </button>
            <button className="noFavorite" onClick={favoriteFilm}>
                {!isFavorite && <MdOutlineBookmarkAdd />}
            </button>
        </div>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        poster_path: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired,
    showLink: PropTypes.bool
};

export default MovieCard;
