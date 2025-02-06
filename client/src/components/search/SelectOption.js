import React, { memo } from 'react';

const SelectOption = ({ icons }) => {
    return (
        <div className="w-14 h-14 bg-white rounded-full border shadow-md flex items-center justify-center hover:bg-main hover:text-white hover:border-gray-400 cursor-pointer">
            {icons}
        </div>
    );
};

export default memo(SelectOption);
