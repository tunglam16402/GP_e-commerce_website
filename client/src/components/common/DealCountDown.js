import React, { memo } from 'react';

const DealCountDown = ({ unit, number }) => {
    return (
        <div className="w-[30%] h-[60px] flex flex-col justify-center items-center rounded-md bg-[#F4F4F4]">
            <span className="text-[18px] text-gray-800">{number}</span>
            <span className="text-xs text-gray-700">{unit}</span>
        </div>
    );
};

export default memo(DealCountDown);
