import Button from 'components/buttons/Button';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { showCart } from 'store/app/appSlice';
import { formatMoney } from 'utils/helper';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { apiRemoveCart } from 'apis';
import { getCurrent } from 'store/users/asyncAction';
import { toast } from 'react-toastify';
import path from 'utils/path';

const Cart = ({ dispatch, navigate }) => {
    const { currentCart } = useSelector((state) => state.user);
    const removeCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color);
        if (response.success) {
            dispatch(getCurrent());
        } else toast.error(response.message);
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-[500px] py-4 px-8 h-screen bg-black grid grid-rows-10 text-white"
        >
            <header className="border-b flex items-center justify-between font-bold text-xl row-span-1 h-full">
                <span className="uppercase">your cart</span>
                <span onClick={() => dispatch(showCart())} className="cursor-pointer p-2">
                    <IoMdClose size={24} />
                </span>
            </header>
            <section className="row-span-6 flex flex-col h-full max-h-full overflow-y-auto py-3">
                {(!currentCart || currentCart.length === 0) && (
                    <span className="text-center text-xl text-gray-300">Your cart is empty.</span>
                )}{' '}
                {currentCart &&
                    currentCart?.map((el) => (
                        <div key={el._id} className="flex justify-between border-b border-gray-700 py-8">
                            <div className="flex gap-2">
                                <img src={el.thumb} alt="thumb" className="w-20 h-20 object-cover"></img>
                                <div className="flex flex-col gap-1">
                                    <span>{el.title}</span>
                                    <span className="text-sm text-gray-300">{el.color}</span>
                                    {el?.product?.price !== el.price ? (
                                        <div className="flex flex-col">
                                            <span className="text-[14px] text-gray-400 line-through">
                                                {formatMoney(el?.product?.price) + ' VND'}
                                            </span>
                                            <span className="text-lg text-red-600 font-semibold">
                                                {formatMoney(el.price) + ' VND'}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-lg text-main font-semibold">
                                            {formatMoney(el.price) + ' VND'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col justify-between items-center">
                                <span
                                    onClick={() => removeCart(el?.product?._id, el.color)}
                                    title="Delete"
                                    className="flex px-4 hover:text-gray-400 cursor-pointer"
                                >
                                    <BsFillTrash3Fill size={18} />
                                </span>
                                <span>{`x ${el.quantity}`}</span>
                            </div>
                        </div>
                    ))}
            </section>
            <div className="row-span-3 h-full">
                <div className="flex items-center justify-between my-4 pt-4 border-t border-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-medium text-lg text-main">
                        {formatMoney(currentCart?.reduce((sum, el) => sum + Number(el.price) * el.quantity, 0)) +
                            ' VND'}
                    </span>
                </div>
                <span className="text-center text-sm text-gray-400 italic">
                    Shipping, taxes, and discounts calculated at checkout.
                </span>
                <Button
                    handleOnclick={() => {
                        dispatch(showCart({ isShowCart: false }));
                        navigate(`${path.DETAIL_CART}`);
                    }}
                    style="rounded-none w-full bg-main py-3 mt-4"
                >
                    Shopping Cart
                </Button>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(Cart));
