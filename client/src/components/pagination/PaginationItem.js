import React, { memo } from 'react';
import clsx from 'clsx';
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom';
import {} from 'react-router';

const PaginationItem = ({ children }) => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const location = useLocation();

    const handlePagination = () => {
        const queries = Object.fromEntries([...params]);
        if (Number(children)) queries.page = children;
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        });
    };

    return (
        <button
            className={clsx(
                'p-4 w-10 h-10 flex items-center justify-center rounded-full ',
                !Number(children) && 'items-end pb-2',
                Number(children) && 'items-center hover:rounded-full hover:bg-main hover:text-white',
                +params.get('page') === +children && 'rounded-full bg-main text-white',
                !+params.get('page') && children === 1 && 'rounded-full bg-main text-white',
            )}
            onClick={handlePagination}
            type="button"
            disabled={!Number(children)}
        >
            {children}
        </button>
    );
};

export default memo(PaginationItem);
