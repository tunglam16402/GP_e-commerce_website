import React, { useEffect, useState } from 'react';
import paymentImage from 'assets/payment.svg';
import { useSelector } from 'react-redux';
import { formatMoney } from 'utils/helper';
import { Congratulation, InputForm, Paypal } from 'components';
import {} from 'react-use';
import withBaseComponent from 'hocs/withBaseComponent';
import { getCurrent } from 'store/users/asyncAction';

const CheckOut = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector((state) => state.user);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            dispatch(getCurrent());
        }
    }, [isSuccess]);

    return (
        <div className="p-8 w-full grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6">
            {isSuccess && <Congratulation />}
            <div className="w-full flex justify-center items-center col-span-3">
                <img src={paymentImage} alt="payment-image" className="h-[70%] object-contain"></img>
            </div>
            <div className="flex w-full flex-col justify-center col-span-7 gap-6">
                <h2 className="text-3xl mb-6 font-bold">CheckOut your order</h2>
                <div className="flex w-full gap-6 ">
                    <div className="flex-1">
                        <table className="table-auto h-fit w-full">
                            <thead>
                                <tr className="border bg-gray-200 ">
                                    <th className="text-left p-2">Products</th>
                                    <th className="text-center p-2">Quantity</th>
                                    <th className="text-right p-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCart?.map((element) => (
                                    <tr className="border" key={element._id}>
                                        <td className="text-left p-2">{element.title}</td>
                                        <td className="text-center p-2">{element.quantity}</td>
                                        <td className="text-right p-2">{formatMoney(element.price) + ' VND'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex-1 flex flex-col justify-between gap-8">
                        <div className="flex flex-col gap-6">
                            <span className="flex items-center gap-8">
                                <span className="text-[20px] font-semibold">Subtotal:</span>
                                <span className="text-main text-2xl font-semibold">{`${formatMoney(
                                    currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0),
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center gap-8">
                                <span className="">Shipping address:</span>
                                <span className=" font-semibold">{current?.address}</span>
                            </span>
                        </div>
                        <div className="w-full mx-auto">
                            <Paypal
                                payload={{
                                    products: currentCart,
                                    total: Math.round(
                                        +currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) / 25360,
                                    ),
                                    address: current?.address,
                                }}
                                setIsSuccess={setIsSuccess}
                                amount={Math.round(
                                    +currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) / 25360,
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(CheckOut);
