import React, { useCallback, useEffect, useState } from 'react';
import { CustomizeVariants, ExportExcelButton, InputForm, Pagination } from 'components';
import { useForm } from 'react-hook-form';
import { apiGetProducts, apiDeleteProduct, apiBanProduct } from 'apis/product';
import moment from 'moment';
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom';
import useDebounce from 'hooks/useDebounce';
import UpdateProduct from './UpdateProduct';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { FaEdit, FaTrashAlt, FaBan } from 'react-icons/fa';
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

    const productColumns = [
        { label: 'ID', key: '_id' },
        { label: 'Title', key: 'title' },
        { label: 'Brand', key: 'brand' },
        { label: 'Category', key: 'category' },
        { label: 'Color', key: 'color' },
        { label: 'Price', key: 'price' },
        { label: 'Discount (%)', key: 'discount' },
        { label: 'Quantity', key: 'quantity' },
        { label: 'Sold', key: 'sold' },
        { label: 'Ratings', key: 'totalRatings' },
        { label: 'Created At', key: 'createdAt' },
    ];

    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
    const [editProduct, setEditProduct] = useState(null);
    const [update, setUpdate] = useState(false);
    const [customizeVariant, setCustomizeVariant] = useState(null);
    const [viewVariantsProduct, setViewVariantsProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleViewVariants = (product) => {
        setViewVariantsProduct(product);
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

    const handleBanProduct = async (pid) => {
        Swal.fire({
            title: 'Ban/Unban product',
            text: 'Are you sure you want to toggle the ban status of this product?',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiBanProduct(pid);
                if (response.success) {
                    toast.success(response.message);

                    setProducts((prev) =>
                        prev.map((product) =>
                            product._id === pid ? { ...product, isBanned: !product.isBanned } : product,
                        ),
                    );
                } else {
                    toast.error(response.message);
                }
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
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight border-b-4 border-red-600 pb-2">
                <span>Manage Products</span>
            </h1>

            <div className="flex justify-end items-center gap-4 py-4">
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
                <ExportExcelButton data={products || []} fileName="Products" columns={productColumns} />
            </div>

            <table className="table-auto mb-6 text-left w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="font-bold uppercase bg-main text-sm text-white text-center">
                    <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Thumb</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Color</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Discount</th>
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
                            className={`border-t border-b border-gray-200 text-center transition-colors ${
                                element.isBanned ? 'bg-gray-300 opacity-70' : 'hover:bg-gray-50'
                            }`}
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
                                    className="w-16 h-16 object-cover rounded-md cursor-pointer"
                                    onClick={() => setSelectedImage(element.thumb)}
                                />
                            </td>
                            <td>{element.title}</td>
                            <td>{element.brand}</td>
                            <td>{element.category}</td>
                            <td>{element.color}</td>
                            <td>{formatMoney(element.price)} VND</td>
                            <td>{element.discount}%</td>
                            <td>{element.quantity}</td>
                            <td>{element.sold}</td>
                            <td>{element.totalRatings}</td>
                            <td>{element?.variants.length || 0}</td>
                            <td>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                            <td className="flex flex-col items-center justify-center my-4 space-y-2">
                                <span
                                    onClick={() => setEditProduct(element)}
                                    className="bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                    title="Edit this product"
                                >
                                    <FaEdit />
                                </span>
                                <span
                                    onClick={() => handleDeleteProduct(element._id)}
                                    className="bg-red-600 text-white hover:bg-red-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                    title="Delete this product"
                                >
                                    <FaTrashAlt />
                                </span>
                                <span
                                    onClick={() => setCustomizeVariant(element)}
                                    className="bg-green-600 text-white hover:bg-green-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                    title="Add new variant to this product"
                                >
                                    <MdAddToPhotos />
                                </span>
                                <span
                                    onClick={() => handleViewVariants(element)}
                                    className="bg-blue-600 text-white hover:bg-blue-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                    title="See all variants"
                                >
                                    <IoEyeSharp />
                                </span>
                                <span
                                    onClick={() => handleBanProduct(element._id)}
                                    className={`cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors ${
                                        element.isBanned
                                            ? 'bg-green-600 text-white hover:bg-green-800'
                                            : 'bg-yellow-600 text-white hover:bg-yellow-800'
                                    }`}
                                    title={element.isBanned ? 'Unban this product' : 'Ban this product'}
                                >
                                    {element.isBanned ? <IoEyeSharp /> : <FaBan />}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>

                {/* Overlay hiển thị ảnh phóng to */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                        onClick={() => setSelectedImage(null)}
                    >
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="max-w-[90%] max-h-[90%] rounded-md shadow-lg"
                            onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào ảnh
                        />
                    </div>
                )}
            </table>

            <div className="w-full flex justify-end mt-4">
                <Pagination totalCount={counts} />
            </div>
        </div>
    );
};

export default ManageProducts;
