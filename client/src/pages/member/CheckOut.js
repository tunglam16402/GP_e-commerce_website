import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatMoney } from 'utils/helper';
import { Congratulation, Paypal } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import { getCurrent } from 'store/users/asyncAction';
import { FaMapMarkerAlt } from 'react-icons/fa';

const CheckOut = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector((state) => state.user);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(current?.address || '');

    useEffect(() => {
        if (isSuccess) {
            dispatch(getCurrent());
        }
    }, [isSuccess]);

    return (
        <div className=" w-main flex flex-col gap-6">
            {isSuccess && <Congratulation />}

            {/* 1️⃣ Shipping Information */}
            <div className="w-full mt-[150px] bg-white p-6 rounded-lg shadow-md">
                {/* Tiêu đề với icon */}
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <FaMapMarkerAlt className="text-red-500" />
                    <h3>Delivery Address</h3>
                </div>

                {/* Nội dung thông tin giao hàng */}
                <div className="flex justify-between mt-4">
                    {/* Họ tên & Số điện thoại */}
                    <div className="flex text-lg gap-2 font-semibold">
                        <p>
                            {current?.lastname || 'Guest'} {current?.firstname || 'Guest'}
                        </p>
                        <p>(+84) {current?.mobile || 'No phone'}</p>
                    </div>

                    {/* Địa chỉ giao hàng */}
                    <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="border p-2 rounded w-[60%]"
                        placeholder="Enter delivery address"
                    />
                </div>
            </div>
            {/* 2️⃣ Danh sách Sản Phẩm */}
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4">CheckOut Your Order</h2>

                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-gray-200 text-gray-700 shadow-md">
                            <tr>
                                <th className="p-3 text-left">#</th>
                                <th className="p-3 text-left">Products</th>
                                <th className="p-3 text-center">Quantity</th>
                                <th className="p-3 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCart?.map((element, index) => (
                                <tr className="border-b hover:bg-gray-100 transition" key={index}>
                                    <td className="p-4 text-gray-700">{index + 1}</td>
                                    <td className="p-4 flex items-center gap-4">
                                        <img
                                            src={element.thumb}
                                            alt={element.title}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium line-clamp-2 max-w-[200px]">
                                                {element.title}
                                            </span>
                                            <span className="text-sm text-gray-500">{element.color}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center text-gray-700">{element.quantity}</td>
                                    <td className="p-4 text-right">
                                        {element?.product?.price !== element.price && (
                                            <span className="text-gray-500 line-through text-sm">
                                                {formatMoney(element?.product?.price) + ' VND'}
                                            </span>
                                        )}
                                        <br />
                                        <span className="text-red-600 text-lg font-semibold">
                                            {formatMoney(element.price) + ' VND'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3️⃣ Tổng tiền + Thanh toán */}
            <div className="w-full bg-white p-6 mb-8 rounded-lg shadow-md flex justify-end">
                <div className="flex flex-col gap-4 w-1/3">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total Quantity:</span>
                        <span className="text-gray-700">{currentCart?.reduce((sum, el) => sum + el.quantity, 0)}</span>
                    </div>

                    <div className="flex justify-between text-xl font-semibold">
                        <span>Subtotal:</span>
                        <span className="text-red-600 text-2xl font-bold">
                            {`${formatMoney(currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0))} VND`}
                        </span>
                    </div>

                    {/* Nút Thanh Toán */}
                    <div className="w-full mx-auto mt-4">
                        <Paypal
                            payload={{
                                products: currentCart,
                                total: Math.round(
                                    +currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) / 25000,
                                ),
                                address: shippingAddress, // Dùng địa chỉ mới thay vì current.address
                            }}
                            setIsSuccess={setIsSuccess}
                            amount={Math.round(
                                +currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) / 25000,
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(CheckOut);
