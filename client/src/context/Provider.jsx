import React, { useState } from 'react';
import AppContext from './AppContext';
import PropTypes from 'prop-types';

function Provider({ children }) {
    const [votes, setVotes] = useState({}); // { 0: "Filme A", 1: "Filme B", ... }
    const saveVote = (categoryIndex, vote) => {
        setVotes((prevVotes) => ({ ...prevVotes, [categoryIndex]: vote }));
    };

    const indicados = [
        
    ];
    


    const value = {
        votes,
        saveVote,
        indicados,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export default Provider;

Provider.propTypes = {
    children: PropTypes.any,
}.isRequired;
