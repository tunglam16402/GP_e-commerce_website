import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { showModal } from '../../store/app/appSlice';

const Modal = ({ children }) => {
    const dispatch = useDispatch();

    return (
        <div
            onClick={() => dispatch(showModal({ isShowModal: false, modalChildren: null }))}
            className="absolute inset-0 z-[99] bg-overlay bg-opacity-70 flex items-center justify-center min-h-screen"
        >
            {children}
        </div>
    );
};

export default memo(Modal);
