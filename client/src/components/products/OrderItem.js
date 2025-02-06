import SelectQuantity from 'components/common/SelectQuantity';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo, useCallback, useState } from 'react';
import { useEffect } from 'react';
import { updateCart } from 'store/users/userSlice';
import { formatMoney } from 'utils/helper';

const OrderItem = ({ dispatch, color, defaultQuantity = 1, price, title, thumb, pid }) => {
    const [quantity, setQuantity] = useState(() => defaultQuantity);

    const handleQuantity = (number) => {
        if (+number > 1) {
            setQuantity(number);
        }
    };

    const handleChangeQuantity = useCallback(
        (flag) => {
            if (flag === 'minus' && quantity === 1) return;
            if (flag === 'minus') setQuantity((prev) => +prev - 1);
            if (flag === 'plus') setQuantity((prev) => +prev + 1);
            // if (quantity === product?.quantity) {
            //     setQuantity(null);
            // }
        },
        [quantity],
    );

    //handle Subtotal when quantity change
    useEffect(() => {
        dispatch(updateCart({ pid, quantity, color }));
    }, [quantity]);

    return (
        <div className="w-main mx-auto font-bold my-8 border-b py-3 grid grid-cols-10">
            <span className="col-span-6 w-full text-center">
                <div className="flex gap-2 text-center h-full items-center ">
                    <img src={thumb} alt="thumb" className="w-[220px] h-[220px] object-cover"></img>
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">{title}</span>
                        <span className="text-sm font-medium text-gray-700">{color}</span>
                    </div>
                </div>
            </span>
            <span className="col-span-1 w-full text-center">
                <div className="flex items-center h-full">
                    <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                    ></SelectQuantity>
                </div>
            </span>
            <span className="col-span-3 w-full text-center h-full flex items-center justify-center">
                <span className="text-[20px] font-semibold">{formatMoney(price * quantity) + ' VND'}</span>
            </span>
        </div>
    );
};

export default withBaseComponent(memo(OrderItem));
