import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import Swal from 'sweetalert2';

const FinalRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (status === 'failed') {
            Swal.fire('Oops', 'Account registration failed', 'error').then(() => {
                navigate(`/${path.AUTH}`);
            });
        }
        if (status === 'success') {
            Swal.fire('Congratulation!', 'Account registration successfully.Please switch to login', 'success').then(
                () => {
                    navigate(`/${path.AUTH}`);
                },
            );
        }
    }, []);
    return <div className="h-screen w-screen bg-gray-100"></div>;
};

export default FinalRegister;
