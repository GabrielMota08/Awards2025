import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import "./genre.modules.css";
import MovieCard from "./MovieCard";
import loading from '../assets/loading.png';
import AppContext from "../context/AppContext";

const apiKey = import.meta.env.VITE_API_KEY;

const Genre = ({ id }) => {
    const [topMovies, setTopMovies] = useState([]);
    const [position, setPosition] = useState(4);
    const [value, setValue] = useState(4);
    const [bottomLeftVisible, setBottomLeftVisible] = useState(false);
    const [bottomVisible, setBottomVisible] = useState(false);
    const {setTopMoviesVisible} = useContext(AppContext);

    const getMoviesGenre = async (url) => {
        const res = await fetch(url);
        const data = await res.json()
        // console.log(data.results); // FILMES ORGANIZADOS EM GENERO

        const shuffledMovies = data.results.sort(() => 0.5 - Math.random());
        setTopMovies(shuffledMovies)
        setTopMoviesVisible(true)
    }
    
    const moveToRight = () => {
        var newValue = value - 83;
        if(newValue < - 180){   
            newValue = 4;
        }
        setBottomLeftVisible(true);
        setValue(newValue);
        setPosition(newValue);
    };

    const moveToLeft = () => {
        var newValue = value + 83;
        if(newValue > 5){
            newValue = -162;
        }
        setValue(newValue);
        setPosition(newValue);
    };

    const enterGenre = () => {
        setBottomVisible(true);
    }
    
    const leaveGenre = () => {
        setBottomVisible(false);
    }

    useEffect(() => {
        const url = `https://api.themoviedb.org/3/discover/movie?${apiKey}&language=pt-BR&ort_by=popularity.desc&with_genres=${id}`
        getMoviesGenre(url);
    }, [])


    return (
        <>
            <section onMouseEnter={enterGenre} onMouseLeave={leaveGenre} className="sectionGenre">
            
            <div onClick={moveToLeft} className="background_button background_buttonLeft">
            <button  className={`${bottomLeftVisible && bottomVisible ? "bottomLeftVisible" : ""} buttonLeft ${bottomVisible && bottomLeftVisible  ? "bottomVisible" : ""}`}>
                <MdOutlineArrowBackIos />
            </button>
            </div>
            <div onClick={moveToRight} className="background_button background_buttonRight">
            <button  className={`${bottomVisible ? "bottomVisible" : ""} buttonRight`}>
                <MdOutlineArrowForwardIos />
            </button>
            </div>
            <div style={{ left: `${position}vw` }} className="genero">
            {topMovies.length > 0 ? (
                <>
                    {topMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
                    <MovieCard key={topMovies[0].id} movie={topMovies[0]} />
                </>
            ) : (
                topMovies.map((movie) => <img key={movie.id} className="movie-card-loading" src={loading} alt="Loading..." />)
            )}
            </div>
            </section>
        </>
    );
};

Genre.propTypes = {
    id: PropTypes.number.isRequired,
};

export default Genre;