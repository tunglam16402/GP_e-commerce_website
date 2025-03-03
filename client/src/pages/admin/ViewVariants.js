import React, { useState } from 'react';
import UpdateVariant from './UpdateVariant';
import { apiDeleteVariant } from 'apis';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ViewVariants = ({ product, render, setViewVariantsProduct }) => {
    const [editVariant, seteditVariant] = useState(null);

    const handleClose = () => {
        setViewVariantsProduct(null); // Đóng modal khi người dùng bấm "Close"
    };

    const handleDeleteVariant = async (sku) => {
        Swal.fire({
            title: 'Delete product variant',
            text: 'Are you sure to delete this product variant?',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log(`Calling API: /product/variant/${sku}`);
                const response = await apiDeleteVariant(sku); // Gọi API xoá variant
                console.log('API Response:', response);

                if (response.success) {
                    toast.success(response.message);
                    render();
                    // Cập nhật lại danh sách variants sau khi xoá
                    const updatedVariants = product.variants.filter((variant) => variant.sku !== sku);
                    setViewVariantsProduct({ ...product, variants: updatedVariants }); // Cập nhật state của product
                } else {
                    toast.error(response.message);
                }
            }
        });
    };

    return (
        <div className="w-full h-full bg-white p-6 rounded-lg shadow-md overflow-auto">
            {editVariant && (
                <div className="inset-0 absolute bg-gray-100 min-h-screen">
                    <UpdateVariant
                        editVariant={editVariant}
                        seteditVariant={seteditVariant}
                        render={render}
                    ></UpdateVariant>
                </div>
            )}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Variants of {product.title}</h2>
                <button onClick={handleClose} className="text-red-500 hover:text-red-700 font-semibold">
                    Close
                </button>
            </div>

            {/* Hiển thị danh sách variant dạng bảng */}
            <div className="mt-4">
                <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="font-bold uppercase w-full bg-main text-sm text-white text-center">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Thumb</th>
                            <th className="px-4 py-3">Variant ID</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Color</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.variants.length > 0 ? (
                            product.variants.map((variant, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-b border-gray-200 text-center hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={variant.thumb}
                                            alt="thumb"
                                            className="w-14 h-14 object-cover rounded-md"
                                        ></img>
                                    </td>
                                    <td className="px-4 py-2">{variant.sku}</td>
                                    <td className="px-4 py-2">{variant.title}</td>
                                    <td className="px-4 py-2">{variant.color}</td>
                                    <td className="px-4 py-2">{variant.price} VND</td>
                                    <td className="px-4 py-2">{variant.discount}</td>
                                    <td className="px-4 py-2 flex flex-col justify-center items-center">
                                        <button
                                            onClick={() => seteditVariant(variant)}
                                            className="text-white px-4 py-1 bg-main hover:text-main hover:bg-white hover:border-main hover:border mb-2 cursor-pointer inline-block rounded-lg transition-colors"
                                        >
                                            Edit Variant
                                        </button>
                                        <button
                                            // onClick={() => handleDeleteVariant(product._id, variant.sku)}
                                            onClick={() => handleDeleteVariant(variant.sku)}
                                            className="text-white px-2 py-1 bg-main hover:text-main hover:bg-white hover:border-main hover:border cursor-pointer inline-block rounded-lg transition-colors"
                                        >
                                            Delete Variant
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                                    No variants available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewVariants;
