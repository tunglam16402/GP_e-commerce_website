import React, { memo } from 'react';

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
    return (
        <div className="flex items-center border">
            <span onClick={() => handleChangeQuantity('minus')} className=" p-2 border-r cursor-pointer select-none bg-gray-100 hover:bg-red-100 active:bg-red-300 border-black">
                -
            </span>
            <input
                className="py-2  outline-none w-[50px] text-center "
                type="number"
                value={quantity}
                onChange={(e) => handleQuantity(e.target.value)}
            ></input>
            <span onClick={() => handleChangeQuantity('plus')} className=" p-2 border-l cursor-pointer select-none bg-gray-100 hover:bg-red-100 active:bg-red-400 border-black">
                +
            </span>
        </div>
    );
};

export default memo(SelectQuantity);
