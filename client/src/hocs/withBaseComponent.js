import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation từ i18next


const withBaseComponent = (Component) => (probs) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { t } = useTranslation(); 

    return <Component {...probs} navigate={navigate} location={location} dispatch={dispatch} t={t}></Component>;
};

export default withBaseComponent;
