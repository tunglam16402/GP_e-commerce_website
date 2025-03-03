import { apiDeleteBlog, apiGetBlog } from 'apis/blog';
import { InputForm, Pagination } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import useDebounce from 'hooks/useDebounce';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import UpdateBlog from './UpdateBlog';
import { apiGetAllCategory, apiGetCategory } from 'apis/productCategory';
import { apiDeleteCategory, apiGetCategories } from 'apis';
import UpdateProductCategory from './UpdateProductCategory';

const ManageProductCategory = ({ navigate, location }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = useForm();
    const [pCategory, setPCategory] = useState(null);
    const [params] = useSearchParams();
    const [counts, setCounts] = useState(0);
    const [editPCategory, setEditPCategory] = useState(null);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const fetchCategory = async (params) => {
        const response = await apiGetCategories({ ...params, limit: +process.env.REACT_APP_LIMIT });
        console.log(response);
        if (response.success) {
            setPCategory(response.productCategories);
            setCounts(response.counts);
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
        fetchCategory(searchParams);
    }, [params, update]);

    const handleDeleteCategory = async (pcid) => {
        Swal.fire({
            title: 'Delete product category',
            text: 'Are you sure to delete this product category?',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteCategory(pcid);
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
        // <div className="w-full max-w-screen-xl flex flex-col p-6 relative bg-gray-50 rounded-lg shadow-lg">
        <div className="w-full max-w-screen-xl relative mx-auto p-8 bg-gradient-to-r from-red-50 via-red-100 to-red-200 rounded-lg shadow-xl">
            {editPCategory && (
                <div className="inset-0 absolute bg-gray-100 min-h-screen">
                    <UpdateProductCategory
                        editPCategory={editPCategory}
                        render={render}
                        setEditPCategory={setEditPCategory}
                    ></UpdateProductCategory>
                </div>
            )}
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight border-b-4 border-red-600 pb-2">
                <span>Manage Product Categories</span>
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
                <thead className="font-bold uppercase bg-main text-sm text-white text-center">
                    <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3 text-start">Image</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Brands</th>
                        <th className="px-4 py-3">Day create</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pCategory?.map((element, index) => (
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
                                    src={element.image}
                                    alt="category-image"
                                    className="w-12 h-12 object-cover rounded-md"
                                ></img>
                            </td>
                            <td>{element.title}</td>
                            <td className="flex gap-2 justify-center items-center">
                                {element.brand.map((br, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 rounded-md">
                                        {br}
                                    </span>
                                ))}
                            </td>
                            <td>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                            <td className="flex flex-col items-center justify-center space-y-2">
                                <span
                                    onClick={() => setEditPCategory(element)}
                                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                >
                                    <FaEdit />
                                </span>
                                <span
                                    onClick={() => handleDeleteCategory(element._id)}
                                    className="text-red-600 hover:text-red-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                >
                                    <FaTrashAlt />
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

export default withBaseComponent(ManageProductCategory);
