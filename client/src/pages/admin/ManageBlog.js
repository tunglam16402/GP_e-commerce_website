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

const ManageBlog = ({ navigate, location }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = useForm();
    const [blogs, setBlogs] = useState(null);
    const [params] = useSearchParams();
    const [counts, setCounts] = useState(0);
    const [editBlog, setEditBlog] = useState(null);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const fetchBlogs = async (params) => {
        const response = await apiGetBlog({ ...params, limit: +process.env.REACT_APP_LIMIT });
        // console.log(response);
        if (response.success) {
            setBlogs(response.blogs);
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
        fetchBlogs(searchParams);
    }, [params, update]);

    const handleDeleteBlog = async (bid) => {
        Swal.fire({
            title: 'Delete blog',
            text: 'Are you sure to delete this blog?',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteBlog(bid);
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
            {editBlog && (
                <div className="inset-0 absolute bg-gray-100 min-h-screen">
                    <UpdateBlog editBlog={editBlog} render={render} setEditBlog={setEditBlog}></UpdateBlog>
                </div>
            )}
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold text-gray-800 border-b-4 border-main px-4">
                <span>Manage Blogs</span>
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
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Author</th>
                        <th className="px-4 py-3">View</th>
                        <th className="px-4 py-3">Likes</th>
                        <th className="px-4 py-3">Dislikes</th>
                        <th className="px-4 py-3">Update at</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs?.map((element, index) => (
                        <tr
                            key={element._id}
                            className="border-t border-b border-gray-200 text-center hover:bg-gray-50 transition-colors"
                        >
                            <td>
                                {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT +
                                    index +
                                    1}
                            </td>
                            <td>{element.title}</td>
                            <td>{element.author}</td>
                            <td>{element.numberViews}</td>
                            <td>{element?.likes?.length}</td>
                            <td>{element?.dislikes?.length}</td>
                            <td>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                            <td className="flex flex-col items-center justify-center space-y-2">
                                <span
                                    onClick={() => setEditBlog(element)}
                                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer px-2 py-1 inline-block rounded-lg transition-colors"
                                >
                                    <FaEdit />
                                </span>
                                <span
                                    onClick={() => handleDeleteBlog(element._id)}
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

export default withBaseComponent(ManageBlog);
