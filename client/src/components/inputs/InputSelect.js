import React, { memo } from 'react';

const InputSelect = ({ value, changeValue, options }) => {
    return (
        <select className="form-select text-sm" value={value} onChange={(e) => changeValue(e.target.value)}>
            <option>Choose</option>
            {options?.map((element) => (
                <option key={element.id} value={element.value}>
                    {element.text}
                </option>
            ))}
        </select>
    );
};

export default memo(InputSelect);
