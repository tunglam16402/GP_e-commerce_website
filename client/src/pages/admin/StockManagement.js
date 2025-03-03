// import React, { useEffect, useState } from 'react';
// import { ExportExcelButton, InputForm, Pagination } from 'components';
// import { useForm } from 'react-hook-form';
// import { apiGetProducts } from 'apis/product';
// import moment from 'moment';
// import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom';
// import useDebounce from 'hooks/useDebounce';
// import { toast } from 'react-toastify';
// import { FaEdit, } from 'react-icons/fa';
// import { formatMoney } from 'utils/helper';

// const StockManagement = () => {
//     const {
//         register,
//         formState: { errors },
//         handleSubmit,
//         reset,
//         watch,
//     } = useForm();

//     const productColumns = [
//         { label: 'ID', key: '_id' },
//         { label: 'Product ID', key: 'id' },
//         { label: 'Title', key: 'title' },
//         { label: 'Brand', key: 'brand' },
//         { label: 'Category', key: 'category' },
//         { label: 'Color', key: 'color' },
//         { label: 'Price', key: 'price' },
//         { label: 'Quantity', key: 'quantity' },
//         { label: 'Created At', key: 'createdAt' },
//     ];

//     const navigate = useNavigate();
//     const location = useLocation();
//     const [products, setProducts] = useState(null);
//     const [counts, setCounts] = useState(0);
//     const [params] = useSearchParams();
//     const [update, setUpdate] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(null);

//     const fetchProducts = async (params) => {
//         const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT, sort: 'quantity' });
//         console.log(response);
//         if (response.success) {
//             setCounts(response.counts);
//             setProducts(response.products);
//         }
//     };

//     const queriesDebounce = useDebounce(watch('q'), 800);

//     useEffect(() => {
//         if (queriesDebounce) {
//             navigate({
//                 pathname: location.pathname,
//                 search: createSearchParams({ q: queriesDebounce }).toString(),
//             });
//         } else {
//             navigate({
//                 pathname: location.pathname,
//             });
//         }
//     }, [queriesDebounce]);

//     useEffect(() => {
//         const searchParams = Object.fromEntries([...params]);
//         fetchProducts(searchParams);
//     }, [params, update]);

//     return (
//         <div className="w-full flex flex-col p-6 relative bg-gray-50 rounded-lg shadow-lg">
//             <h1 className="text-4xl font-semibold text-gray-900 tracking-tight border-b-4 border-red-600 pb-2">
//                 <span>Manage Stock</span>
//             </h1>

//             <div className="flex justify-end items-center gap-4 py-4">
//                 <form className="w-[40%] max-w-lg">
//                     <InputForm
//                         id="q"
//                         register={register}
//                         errors={errors}
//                         fullWidth
//                         placeholder="Search products by title, description, etc."
//                         className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                 </form>
//                 <ExportExcelButton data={products || []} fileName="Products" columns={productColumns} />
//             </div>

//             <table className="table-auto mb-6 text-left w-full bg-white shadow-md rounded-lg overflow-hidden">
//                 <thead className="font-bold uppercase bg-main text-sm text-white text-center">
//                     <tr>
//                         <th className="px-4 py-3">#</th>
//                         <th className="px-4 py-3">Product ID</th>
//                         <th className="px-4 py-3">Thumb</th>
//                         <th className="px-4 py-3">Title</th>
//                         <th className="px-4 py-3">Brand</th>
//                         <th className="px-4 py-3">Category</th>
//                         <th className="px-4 py-3">Price</th>
//                         <th className="px-4 py-3">Quantity</th>
//                         <th className="px-4 py-3">Update at</th>
//                         <th className="px-4 py-3">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products?.map((element, index) => (
//                         <tr
//                             key={element._id}
//                             className={`border-t border-b border-gray-200 text-center transition-colors relative ${
//                                 element.quantity === 0 ? 'opacity-50' : 'hover:bg-gray-50'
//                             }`}
//                         >
//                             <td>
//                                 {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT +
//                                     index +
//                                     1}
//                             </td>
//                             <td>{element._id}</td>

//                             <td>
//                                 <img
//                                     src={element.thumb}
//                                     alt="thumb"
//                                     className="w-16 h-16 object-cover rounded-md cursor-pointer"
//                                     onClick={() => setSelectedImage(element.thumb)}
//                                 />
//                             </td>
//                             <td>{element.title}</td>
//                             <td>{element.brand}</td>
//                             <td>{element.category}</td>
//                             <td>{formatMoney(element.price)} VND</td>
//                             <td>{element.quantity}</td>
//                             <td>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
//                             <td className="flex flex-col items-center justify-center my-4 space-y-2">
//                                 <span
//                                     className={`bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors ${
//                                         element.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                                     }`}
//                                     title="Edit this product"
//                                 >
//                                     <FaEdit />
//                                 </span>
//                             </td>

//                             {/* Chỉ hiển thị thông báo Out of Stock nếu quantity === 0 */}
//                             {element.quantity === 0 && (
//                                 <td className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-xl font-bold">
//                                     <span>Out of Stock</span>
//                                 </td>
//                             )}
//                         </tr>
//                     ))}
//                 </tbody>

//                 {/* Overlay hiển thị ảnh phóng to */}
//                 {selectedImage && (
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
//                         onClick={() => setSelectedImage(null)}
//                     >
//                         <img
//                             src={selectedImage}
//                             alt="Preview"
//                             className="max-w-[90%] max-h-[90%] rounded-md shadow-lg"
//                             onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào ảnh
//                         />
//                     </div>
//                 )}
//             </table>

//             <div className="w-full flex justify-end mt-4">
//                 <Pagination totalCount={counts} />
//             </div>
//         </div>
//     );
// };

// export default StockManagement;
import React, { useEffect, useState } from 'react';
import { ExportExcelButton, InputForm, Pagination } from 'components';
import { useForm } from 'react-hook-form';
import { apiGetProducts, apiUpdateProductQuantity } from 'apis/product'; // Import API cập nhật
import moment from 'moment';
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom';
import useDebounce from 'hooks/useDebounce';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import { formatMoney } from 'utils/helper';

const StockManagement = () => {
    const {
        register,
        formState: { errors },
        watch,
    } = useForm();

    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
    const [update, setUpdate] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // State cho modal cập nhật quantity
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newQuantity, setNewQuantity] = useState('');

    const fetchProducts = async (params) => {
        const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT, sort: 'quantity' });
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

    // Mở modal chỉnh sửa quantity
    const openEditModal = (product) => {
        setSelectedProduct(product);
        setNewQuantity(product.quantity);
        setIsModalOpen(true);
    };

    // Gửi request cập nhật quantity
    const handleUpdateQuantity = async () => {
        if (!selectedProduct || newQuantity < 0 || isNaN(newQuantity)) {
            toast.error('Please enter valid quantity');
            return;
        }

        const response = await apiUpdateProductQuantity(newQuantity, selectedProduct._id);

        if (response.success) {
            toast.success('Quantity Updated');
            setUpdate(!update);
            setIsModalOpen(false);
        } else {
            toast.error('Update failed');
        }
    };

    return (
        <div className="w-full flex flex-col p-6 relative bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight border-b-4 border-red-600 pb-2">
                <span>Manage Stock</span>
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
                <ExportExcelButton data={products || []} fileName="Products" />
            </div>

            <table className="table-auto mb-6 text-left w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="font-bold uppercase bg-main text-sm text-white text-center">
                    <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Product ID</th>
                        <th className="px-4 py-3">Thumb</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Update at</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((element, index) => (
                        <tr
                            key={element._id}
                            className={`border-t border-b border-gray-200 text-center transition-colors relative ${
                                element.quantity === 0 ? 'opacity-50' : 'hover:bg-gray-50'
                            }`}
                        >
                            <td>
                                {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT +
                                    index +
                                    1}
                            </td>
                            <td>{element._id}</td>

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
                            <td>{formatMoney(element.price)} VND</td>
                            <td>{element.quantity}</td>
                            <td>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                            <td>
                                <button
                                    className="bg-indigo-600 text-white hover:bg-indigo-800 px-2 py-1 rounded-lg transition-colors"
                                    onClick={() => openEditModal(element)}
                                >
                                    <FaEdit />
                                </button>
                            </td>

                            {element.quantity === 0 && (
                                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-xl font-bold pointer-events-none">
                                    Out of Stock
                                </div>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination totalCount={counts} />

            {/* Modal chỉnh sửa số lượng */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4 text-center">Update product quantity</h2>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New quantity:</label>
                        <input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)}
                            className="border border-gray-300 p-2 rounded-md w-full focus:ring-indigo-500"
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateQuantity}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-800"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockManagement;
