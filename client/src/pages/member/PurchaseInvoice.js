import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState, memo } from 'react';
import { apiGetUserOrders } from 'apis';
import { formatMoney } from 'utils/helper';
import moment from 'moment';
import logo from 'assets/img/logo.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PurchaseInvoice = () => {
    const [latestOrder, setLatestOrder] = useState(null);

    const handleExportPDF = () => {
        const invoiceElement = document.getElementById('invoice');
        html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`invoice_${latestOrder._id}.pdf`);
        });
    };

    // useEffect(() => {
    //     const fetchLatestOrder = async () => {
    //         try {
    //             const response = await apiGetUserOrders();
    //             if (response?.orders?.length > 0) {
    //                 // Sắp xếp theo createdAt giảm dần và lấy đơn mới nhất
    //                 const sortedOrders = response.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    //                 setLatestOrder(sortedOrders[0]);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch orders:', error);
    //         }
    //     };
    //     fetchLatestOrder();
    // }, []);
    useEffect(() => {
        const fetchLatestOrder = async () => {
            try {
                const response = await apiGetUserOrders({ sort: '-createdAt' });
                if (response?.orders?.length > 0) {
                    console.log(response);
                    const latestOrder = response.orders.reduce(
                        (latest, order) => (new Date(order.createdAt) > new Date(latest.createdAt) ? order : latest),
                        response.orders[0],
                    );
                    setLatestOrder(latestOrder);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };
        fetchLatestOrder();
    }, []);

    if (!latestOrder) return <p>Loading latest invoice...</p>;

    return (
        <div className="w-full flex flex-col mt-[150px] mb-8 items-center relative">
            <div id="invoice" className="bg-white w-full px-12 pb-12 rounded-2xl shadow-xl max-w-7xl space-y-8">
                {/* Header: Logo và thông tin cửa hàng */}
                <div className="flex justify-between items-center border-b pb-6">
                    <div className="flex items-center mt-6 space-x-6">
                        {/* <img src="../" alt="Logo" className="h-20" /> */}
                        <div>
                            {/* <h1 className="text-3xl font-bold">Digital World</h1> */}
                            <img src={logo} alt="Logo" className="mb-2" />

                            <p className="text-lg">123 Tuan Xuan, Hanoi, Vietnam</p>
                            <p className="text-lg">Phone: (+84) 123 456 789 </p>
                            <p className="text-lg">Email: gpecommerce@gmail.com</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl">
                            <strong>Order ID:</strong> {latestOrder._id}
                        </p>
                        <p className="text-xl">
                            <strong>Order Status:</strong> {latestOrder.status}
                        </p>
                    </div>
                </div>

                {/* Tiêu đề hóa đơn */}
                <h2 className="text-4xl font-bold text-center text-gray-900">Purchase Invoice</h2>

                {/* Thông tin đơn hàng */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-gray-700 mb-6">
                    <div className="space-y-6">
                        <p className="text-xl">
                            <strong>Customer:</strong> {latestOrder.orderBy?.lastname} {latestOrder.orderBy?.firstname}
                        </p>
                        <p className="text-xl">
                            <strong>Email:</strong> {latestOrder.orderBy?.email}
                        </p>
                        <p className="text-xl">
                            <strong>Phone:</strong> {latestOrder.orderBy?.mobile}
                        </p>
                    </div>
                    <div className="space-y-6 text-right">
                        <p className="text-xl">
                            <strong>Order Date:</strong> {moment(latestOrder.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                        </p>
                        <p className="text-xl">
                            <strong>Address:</strong> {latestOrder.orderBy?.address}
                        </p>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="mt-8">
                    {/* <h3 className="text-3xl font-semibold text-gray-900 mb-6">Products</h3> */}
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto border border-gray-700">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100 text-left text-xl text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">Product ID</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Color</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg text-gray-800 border-gray-600">
                                {latestOrder.products.map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50 transition-all">
                                        <td className="px-6 py-4">{item._id}</td>
                                        <td className="px-6 py-4 flex items-center space-x-6">
                                            <span>{item.title}</span>
                                        </td>
                                        <td className="px-6 py-4">{item.color}</td>
                                        <td className="px-6 py-4">{formatMoney(item.price)} VND</td>
                                        <td className="px-6 py-4 text-center">{item.quantity}</td>
                                        <td className="px-6 py-4">{formatMoney(item.quantity * item.price)} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tổng kết hóa đơn */}
                <div className="mt-8 text-2xl font-semibold text-gray-800 border-t pt-6">
                    <div className="mt-4 flex justify-between">
                        <p>Total Quantity:</p>
                        <p>{latestOrder.products.reduce((acc, item) => acc + item.quantity, 0)} items</p>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <p>Total Price:</p>
                        <p>{formatMoney(latestOrder.total * 25000)} VND</p>
                    </div>
                    <div className="mt-4 text-right text-[20px] text-gray-700">
                        <p>
                            Payment Method: <strong>Paypal</strong>
                        </p>
                        <p>
                            Payment Status: <strong>Paid</strong>
                        </p>
                    </div>
                </div>

                {/* Lời cảm ơn */}
                <div className="text-center mt-8 text-xl font-semibold text-gray-700 border-t pt-6">
                    <p>Thank you for shopping with us!</p>
                    <p>We appreciate your business and hope to see you again soon.</p>
                </div>
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleExportPDF}
                    className="bg-main text-white px-4 py-2 rounded-lg shadow-md print:hidden"
                >
                    Export to PDF
                </button>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(PurchaseInvoice));
