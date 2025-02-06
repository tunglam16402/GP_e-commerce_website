import React, { useCallback, useEffect, useState } from 'react';
import { CustomizeVariants, InputForm, Pagination } from 'components';
import { useForm } from 'react-hook-form';
import { apiGetProducts, apiDeleteProduct } from 'apis/product';
import moment from 'moment';
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom';
import useDebounce from 'hooks/useDebounce';
import UpdateProduct from './UpdateProduct';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import { MdAddToPhotos } from 'react-icons/md';
import ViewVariants from './ViewVariants';
import { formatMoney } from 'utils/helper';

const ManageProducts = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = useForm();

    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
    const [editProduct, setEditProduct] = useState(null);
    const [update, setUpdate] = useState(false);
    const [customizeVariant, setCustomizeVariant] = useState(null);
    const [viewVariantsProduct, setViewVariantsProduct] = useState(null); // Thêm state cho sản phẩm cần xem variants

    const handleViewVariants = (product) => {
        setViewVariantsProduct(product); // Đưa sản phẩm vào state viewVariantsProduct để hiển thị variant
    };

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const fetchProducts = async (params) => {
        const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT });
        console.log(response);
        if (response.success) {
            setCounts(response.counts);
            setProducts(response.products);
        }
    };

    const queriesDebounce = useDebounce(watch('q'), 800);

    useEffect(() => {
        if (queriesDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queriesDebounce }).toString(),
            });
        } else {
            navigate({
                pathname: location.pathname,
            });
        }
    }, [queriesDebounce]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchProducts(searchParams);
    }, [params, update]);

    const handleDeleteProduct = async (pid) => {
        Swal.fire({
            title: 'Delete product',
            text: 'Are you sure to delete this product?',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteProduct(pid);
                if (response.success) {
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
                render();
            }
        });
    };

    return (
        // <div className="w-full flex flex-col p-4 relative">
        <div className="w-full flex flex-col p-6 relative bg-gray-50 rounded-lg shadow-lg">
            {editProduct && (
                <div className="inset-0 absolute bg-gray-100 min-h-screen">
                    <UpdateProduct
                        editProduct={editProduct}
                        render={render}
                        setEditProduct={setEditProduct}
                    ></UpdateProduct>
                </div>
            )}
            {customizeVariant && (
                <div className="inset-0 absolute bg-gray-100 min-h-screen">
                    <CustomizeVariants
                        customizeVariant={customizeVariant}
                        render={render}
                        setCustomizeVariant={setCustomizeVariant}
                    ></CustomizeVariants>
                </div>
            )}

            {viewVariantsProduct && (
                <div className="inset-0 absolute bg-gray-100 min-h-screen">
                    <ViewVariants
                        product={viewVariantsProduct}
                        setViewVariantsProduct={setViewVariantsProduct}
                        render={render}
                    />
                </div>
            )}
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold text-gray-800 border-b-4 border-main px-4">
                <span>Manage Products</span>
            </h1>

            <div className="flex justify-end items-center py-4">
                <form className="w-[40%] max-w-lg">
                    <InputForm
                        id="q"
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder="Search products by title, description, etc."
                        className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </form>
            </div>

            <table className="table-auto mb-6 text-left w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="font-bold bg-main text-sm text-white text-center">
                    <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Thumb</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Color</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Sold</th>
                        <th className="px-4 py-3">Ratings</th>
                        <th className="px-4 py-3">Variants</th>
                        <th className="px-4 py-3">Update at</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((element, index) => (
                        <tr
                            key={element._id}
                            className="border-t border-b border-gray-200 text-center hover:bg-gray-50 transition-colors"
                        >
                            <td>
                                {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT +
                                    index +
                                    1}
                            </td>
                            <td>
                                <img
                                    src={element.thumb}
                                    alt="thumb"
                                    className="w-16 h-16 object-cover rounded-md"
                                ></img>
                            </td>
                            <td>{element.title}</td>
                            <td>{element.brand}</td>
                            <td>{element.category}</td>
                            <td>{element.color}</td>
                            <td>{formatMoney(element.price)} VND</td>
                            <td>{element.quantity}</td>
                            <td>{element.sold}</td>
                            <td>{element.totalRatings}</td>
                            <td>{element?.variants.length || 0}</td>
                            <td>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                            <td className="flex flex-col items-center justify-center space-y-2">
                                <span
                                    onClick={() => setEditProduct(element)}
                                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                    title="Edit this product"
                                >
                                    <FaEdit />
                                </span>
                                <span
                                    onClick={() => handleDeleteProduct(element._id)}
                                    className="text-red-600 hover:text-red-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                    title="Delete this product"
                                >
                                    <FaTrashAlt />
                                </span>
                                <span
                                    onClick={() => setCustomizeVariant(element)}
                                    className="text-green-600 hover:text-green-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                    title="Add new variant to this product"
                                >
                                    <MdAddToPhotos />
                                </span>
                                <span
                                    onClick={() => handleViewVariants(element)} // Mở modal để xem variant
                                    className="text-blue-600 hover:text-blue-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                    title="See all variants "
                                >
                                    <IoEyeSharp />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="w-full flex justify-end mt-4">
                <Pagination totalCount={counts} />
            </div>
        </div>
    );
};

export default ManageProducts;
