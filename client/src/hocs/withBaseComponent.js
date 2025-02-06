import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const withBaseComponent = (Component) => (probs) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    return <Component {...probs} navigate={navigate} location={location} dispatch={dispatch}></Component>;
};

export default withBaseComponent;
