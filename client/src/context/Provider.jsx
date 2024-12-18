import React, { useState } from 'react';
import AppContext from './AppContext';
import PropTypes from 'prop-types';

function Provider({children}){

    const [topMoviesVisible, setTopMoviesVisible] = useState(false);
    const [watchListMovies, setWatchListMovies] = useState([])

    const value = {
        topMoviesVisible, 
        setTopMoviesVisible,
        watchListMovies, 
        setWatchListMovies,
    };
    return(
        <AppContext.Provider value={ value }>
            {children}
        </AppContext.Provider>
    );
}

export default Provider;

Provider.propTypes = {
    children: PropTypes.any,
}.isRequired;
