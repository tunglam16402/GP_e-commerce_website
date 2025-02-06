import React, { memo } from 'react';
import usePagination from 'hooks/usePagination';
import { PaginationItem } from 'components';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams();
    const pagination = usePagination(totalCount, +params.get('page') || 1);
    const range = () => {
        const currentPage = +params.get('page');
        const pageSize = +process.env.REACT_APP_LIMIT || 10;
        const start = Math.min((currentPage - 1) * pageSize + 1, totalCount);
        const end = Math.min(currentPage * pageSize, totalCount);
        return `${start} - ${end}`;
    };
    return (
        <div className="flex w-main justify-between items-center">
            {!+params.get('page') ? (
                <span className="italic">{`Show product from ${Math.min(totalCount, 1)} - ${Math.min(
                    +process.env.REACT_APP_LIMIT,
                    totalCount,
                )} of ${totalCount} products`}</span>
            ) : (
                ''
            )}
            {+params.get('page') ? (
                <span className="italic">{`Show product from ${range()} of ${totalCount} products`}</span>
            ) : (
                ''
            )}
            <div className="flex items-center">
                {pagination?.map((element) => (
                    <PaginationItem key={element}>{element}</PaginationItem>
                ))}
            </div>
        </div>
    );
};

export default memo(Pagination);
