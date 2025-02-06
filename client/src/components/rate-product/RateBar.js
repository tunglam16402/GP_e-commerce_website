import React, { useRef, useEffect, memo } from 'react';
import icons from '../../utils/icons';

const { AiFillStar } = icons;

const RateBar = ({ number, ratingsCount, ratingsTotal }) => {
    const percentRef = useRef();
    useEffect(() => {
        const percent = Math.round((ratingsCount * 100) / ratingsTotal) || 0;
        percentRef.current.style.cssText = `right: ${100 - percent}%`;
    }, [ratingsCount, ratingsTotal]);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex w-[10%] items-center gap-1 justify-center text-sm">
                <span>{number}</span>
                <AiFillStar color="orange"></AiFillStar>
            </div>
            <div className="w-[75%]">
                <div className="w-full h-[6px] relative  bg-gray-200 rounded-l-full rounded-r-full">
                    <div ref={percentRef} className="absolute inset-0 bg-red-500 "></div>
                </div>
            </div>
            <div className="w-[15%] flex justify-end text-400">{`${ratingsCount || 0} reviewers`}</div>
        </div>
    );
};

export default memo(RateBar);
