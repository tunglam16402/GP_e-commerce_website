import React, { useEffect, useState } from 'react';
import {} from 'react-use';
import withBaseComponent from 'hocs/withBaseComponent';
import moment from 'moment';
import { apiSendMailOrderSuccess, apiUpdateOrderStatus } from 'apis';
import { toast } from 'react-toastify';
import { formatMoney } from 'utils/helper';

const statusOptions = [
    { label: 'Processing', value: 'Processing' },
    { label: 'Succeed', value: 'Succeed' },
    { label: 'Canceled', value: 'Canceled' },
];

const DetailOrder = ({ seeDetail, setSeeDetail, updateOrderStatus }) => {
    const handleChangeStatus = async (e) => {
        const newStatus = e.target.value;
        if (['Processing', 'Succeed', 'Canceled'].includes(newStatus)) {
            try {
                const response = await apiUpdateOrderStatus(seeDetail._id, newStatus);
                if (response.success) {
                    toast.success('Status has been updated');
                    setSeeDetail({ ...seeDetail, status: newStatus });
                    updateOrderStatus(seeDetail._id, newStatus);

                    // Gửi email nếu trạng thái là "Succeed"
                    if (newStatus === 'Succeed') {
                        try {
                            const emailRes = await apiSendMailOrderSuccess({
                                email: seeDetail.orderBy.email,
                                orderId: seeDetail._id,
                                fullname: `${seeDetail.orderBy.lastname} ${seeDetail.orderBy.firstname}`,
                                orderDate: seeDetail.createdAt,
                                products: seeDetail.products,
                                totalPrice: seeDetail.products.reduce(
                                    (acc, item) => acc + item.quantity * item.price,
                                    0,
                                ),
                                address: seeDetail.orderBy.address,
                            });

                            if (emailRes.data.success) {
                                toast.success('Order confirmation email sent!');
                            } else {
                                toast.warning('Failed to send confirmation email');
                            }
                        } catch (emailError) {
                            console.error('Email sending error:', emailError);
                            toast.error('Error sending email');
                        }
                    }
                } else {
                    toast.warning('Status cannot be updated');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('An error occurred while updating the status');
            }
        }
    };

    return (
        <div className="w-full flex flex-col items-center z-50 relative">
            <div className="bg-white w-full px-12 pb-12 rounded-2xl shadow-xl max-w-7xl space-y-8">
                <div className="flex justify-between right-0 left-[289px] px-4 bg-main z-50 items-center fixed">
                    <h1 className="h-[75px] flex justify-between text-white items-center text-3xl font-bold ">
                        Order Detail
                    </h1>
                    <span className="text-white hover:underline cursor-pointer" onClick={() => setSeeDetail(null)}>
                        Cancel
                    </span>
                </div>

                <div className="grid grid-cols-1 pt-[75px] lg:grid-cols-2 gap-12 text-gray-700 mb-6">
                    <div className="space-y-6">
                        <p className="text-xl ">
                            <strong>Order ID:</strong> {seeDetail._id}
                        </p>

                        <p className="text-xl">
                            <strong>Orderer:</strong> {seeDetail.orderBy?.lastname} {seeDetail.orderBy?.firstname}
                        </p>

                        <p className="text-xl">
                            <strong>Email:</strong> {seeDetail.orderBy?.email}
                        </p>
                        <p className="text-xl">
                            <strong>Mobile:</strong> {seeDetail.orderBy?.mobile}
                        </p>
                    </div>

                    <div className="space-y-6 text-right">
                        <p className="text-xl ">
                            <strong>Status:</strong>
                            <select
                                value={seeDetail.status}
                                onChange={handleChangeStatus}
                                className={`ml-3 px-6 py-2 border rounded-lg cursor-pointer text-lg font-semibold ${
                                    seeDetail.status === 'Canceled'
                                        ? 'bg-red-600 text-white'
                                        : seeDetail.status === 'Processing'
                                        ? 'bg-yellow-500 text-white'
                                        : seeDetail.status === 'Succeed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100'
                                }`}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </p>
                        <p className="text-xl">
                            <strong>Address:</strong> {seeDetail.orderBy?.address}
                        </p>
                        <p className="text-xl">
                            <strong>Order Date:</strong> {moment(seeDetail.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-3xl font-semibold text-gray-900 mb-6">Products</h3>

                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg border border-gray-200">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100 text-left text-xl text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Color</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg text-gray-800">
                                {seeDetail.products.map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50 transition-all">
                                        <td className="px-6 py-4 flex items-center space-x-6">
                                            <img
                                                src={item.thumb}
                                                alt={item.title}
                                                className="w-20 h-20 object-cover rounded-md border"
                                            />
                                            <span>{item.title}</span>
                                        </td>
                                        <td className="px-6 py-4">{item.quantity}</td>
                                        <td className="px-6 py-4">{item.color}</td>
                                        <td className="px-6 py-4">{`${formatMoney(item.price)} VNĐ`}</td>
                                        <td className="px-6 py-4">{`${formatMoney(
                                            item.quantity * item.price,
                                        )} VNĐ`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex justify-between text-2xl font-semibold text-gray-800 border-t pt-6">
                        <p>Total Quantity:</p>
                        <p>{seeDetail.products.reduce((acc, item) => acc + item.quantity, 0)} items</p>
                    </div>

                    <div className="mt-4 flex justify-between text-2xl font-semibold text-gray-800">
                        <p>Total Price:</p>
                        <p>
                            {`${formatMoney(
                                seeDetail.products.reduce((acc, item) => acc + item.quantity * item.price, 0),
                            )} VNĐ`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(DetailOrder);
