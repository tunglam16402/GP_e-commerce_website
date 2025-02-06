import React, { useEffect, useState, useCallback, memo } from 'react';
import { apiGetUsers, apiUpdateUsers, apiDeleteUsers } from 'apis/user';
import { role, blockStatus } from 'utils/constant';
import moment from 'moment';
import { InputField, Pagination, InputForm, Select, Button } from 'components';
import useDebounce from 'hooks/useDebounce';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

const ManageUsers = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm({
        email: '',
        firstname: '',
        lastname: '',
        role: '',
        phone: '',
        isBlocked: '',
    });
    const [editElement, setEditElement] = useState(null);
    const [users, setUsers] = useState(null);
    const [queries, setQueries] = useState({
        q: '',
    });
    // const [update, setUpdate] = useState(false);
    const [params] = useSearchParams();

    const fetchUsers = async (params) => {
        const response = await apiGetUsers({ ...params, limit: +process.env.REACT_APP_LIMIT });
        if (response.success) setUsers(response);
    };

    //handle update user info
    // const render = useCallback(() => {
    //     setUpdate(!update);
    // }, [update]);

    const queriesDebounce = useDebounce(queries.q, 800);

    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (queriesDebounce) {
            queries.q = queriesDebounce;
        }
        fetchUsers(queries);
    }, [queriesDebounce, params]);

    //handle update user info
    const handleUpdate = async (data) => {
        const response = await apiUpdateUsers(data, editElement._id);
        if (response.success) {
            setEditElement(null);
            fetchUsers(Object.fromEntries([...params]));
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    };

    //handle delete user info
    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: 'Delete user',
            text: 'Are you sure to delete this user?',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUsers(uid);
                if (response.success) {
                    fetchUsers(Object.fromEntries([...params]));
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            }
        });
    };

    useEffect(() => {
        if (editElement)
            reset({
                email: editElement.email,
                firstname: editElement.firstname,
                lastname: editElement.lastname,
                role: editElement.role,
                mobile: editElement.mobile,
                isBlocked: editElement.isBlocked,
            });
    }, [editElement]);

    return (
        // <div className={clsx('w-full', editElement && 'pl-16')}>
        //     <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold p-4 border-b-2 border-red-500">
        //         <span>Manage User</span>
        //     </h1>
        //     <div className="w-full p-4">
        //         <div className="flex justify-end py-4">
        //             <InputField
        //                 nameKey={'q'}
        //                 value={queries.q}
        //                 setValue={setQueries}
        //                 style={'w-[500px]'}
        //                 placeholder={'Search name or mail user...'}
        //                 isHideLabel
        //             ></InputField>
        //         </div>
        //         <form onSubmit={handleSubmit(handleUpdate)}>
        //             {editElement && <Button type="submit">Update</Button>}
        //             <table className="table-auto mb-6 text-left w-full">
        //                 <thead className="font-bold bg-gray-700 text-[14px]  text-white">
        //                     <tr>
        //                         <th className="px-4 py-2">#</th>
        //                         <th className="px-4 py-2">Email address</th>
        //                         <th className="px-4 py-2">Lastname</th>
        //                         <th className="px-4 py-2">Firstname</th>
        //                         <th className="px-4 py-2">Role</th>
        //                         <th className="px-4 py-2">Phone</th>
        //                         <th className="px-4 py-2">Status</th>
        //                         <th className="px-4 py-2">Created at</th>
        //                         <th className="px-4 py-2">Actions</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {users?.users?.map((element, index) => (
        //                         <tr key={element._id} className="border border-gray-500">
        //                             <td className="py-2 px-4">{index + 1}</td>
        //                             <td className="py-2 px-4">
        //                                 {editElement?._id === element._id ? (
        //                                     <InputForm
        //                                         register={register}
        //                                         fullWidth
        //                                         errors={errors}
        //                                         id={'email'}
        //                                         validate={{
        //                                             required: 'Require fill',
        //                                             pattern: {
        //                                                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        //                                                 message: 'Invalid email address',
        //                                             },
        //                                         }}
        //                                         defaultValue={editElement?.email}
        //                                     />
        //                                 ) : (
        //                                     <span>{element.email}</span>
        //                                 )}
        //                             </td>
        //                             <td className="py-2 px-4">
        //                                 {editElement?._id === element._id ? (
        //                                     <InputForm
        //                                         register={register}
        //                                         fullWidth
        //                                         errors={errors}
        //                                         id={'lastname'}
        //                                         validate={{ required: 'Require fill' }}
        //                                         defaultValue={editElement?.lastname}
        //                                     />
        //                                 ) : (
        //                                     <span>{element.lastname}</span>
        //                                 )}
        //                             </td>
        //                             <td className="py-2 px-4">
        //                                 {editElement?._id === element._id ? (
        //                                     <InputForm
        //                                         register={register}
        //                                         fullWidth
        //                                         errors={errors}
        //                                         id={'firstname'}
        //                                         validate={{ required: 'Require fill' }}
        //                                         defaultValue={editElement?.firstname}
        //                                     />
        //                                 ) : (
        //                                     <span>{element.firstname}</span>
        //                                 )}
        //                             </td>
        //                             <td className="py-2 px-4">
        //                                 {editElement?._id === element._id ? (
        //                                     <Select
        //                                         register={register}
        //                                         fullWidth
        //                                         errors={errors}
        //                                         id={'role'}
        //                                         validate={{ required: 'Require fill' }}
        //                                         defaultValue={+element.role}
        //                                         options={role}
        //                                     />
        //                                 ) : (
        //                                     <span>{role.find((role) => +role.code === +element.role)?.value}</span>
        //                                 )}
        //                             </td>
        //                             <td className="py-2 px-4">
        //                                 {editElement?._id === element._id ? (
        //                                     <InputForm
        //                                         register={register}
        //                                         fullWidth
        //                                         errors={errors}
        //                                         id={'mobile'}
        //                                         validate={{
        //                                             required: 'Require fill',
        //                                             pattern: {
        //                                                 value: /^[62|0]+\d{9}/gi,
        //                                                 message: 'Invalid phone number',
        //                                             },
        //                                         }}
        //                                         defaultValue={editElement?.mobile}
        //                                     />
        //                                 ) : (
        //                                     <span>{element.mobile}</span>
        //                                 )}
        //                             </td>
        //                             <td className="py-2 px-4">
        //                                 {editElement?._id === element._id ? (
        //                                     <Select
        //                                         register={register}
        //                                         fullWidth
        //                                         errors={errors}
        //                                         id={'isBlocked'}
        //                                         validate={{ required: 'Require fill' }}
        //                                         defaultValue={element.isBlocked}
        //                                         options={blockStatus}
        //                                     />
        //                                 ) : (
        //                                     <span>{element.isBlocked ? 'Blocked' : 'Active'}</span>
        //                                 )}
        //                             </td>
        //                             <td className="py-2 px-4">{moment(element.createdAt).format('DD/MM/YYYY')}</td>
        //                             <td className="py-2 px-4">
        //                                 {editElement?._id === element._id ? (
        //                                     <span
        //                                         onClick={() => setEditElement(null)}
        //                                         className="px-2 text-red-500 hover:underline cursor-pointer"
        //                                     >
        //                                         Back
        //                                     </span>
        //                                 ) : (
        //                                     <span
        //                                         onClick={() => setEditElement(element)}
        //                                         className="px-2 text-red-500 hover:underline cursor-pointer"
        //                                     >
        //                                         Edit
        //                                     </span>
        //                                 )}
        //                                 <span
        //                                     onClick={() => handleDeleteUser(element._id)}
        //                                     className="px-2 text-red-500 hover:underline cursor-pointer"
        //                                 >
        //                                     Delete
        //                                 </span>
        //                             </td>
        //                         </tr>
        //                     ))}
        //                 </tbody>
        //             </table>
        //         </form>
        //     </div>
        //     <div className="w-full flex justify-end">
        //         <Pagination totalCount={users?.counts}></Pagination>
        //     </div>
        // </div>
        <div className={clsx('w-full', editElement && 'pl-16')}>
            {/* Title Section */}
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-extrabold p-4 bg-gradient-to-r from-red-500 to-red-700 text-white border-b-4 border-red-800 rounded-t-lg shadow-md">
                <span>Manage User</span>
            </h1>

            <div className="w-full p-6 bg-white shadow-lg rounded-lg">
                {/* Search Bar */}
                <div className="flex justify-end py-4">
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style={'w-[500px]'}
                        placeholder={'Search name or mail user...'}
                        isHideLabel
                    />
                </div>

                {/* Form and Table */}
                <form onSubmit={handleSubmit(handleUpdate)}>
                    {editElement && (
                        <Button
                            type="submit"
                            className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-300"
                        >
                            Update
                        </Button>
                    )}

                    <table className="table-auto mb-6 text-left w-full text-sm">
                        <thead className="font-bold bg-red-600 text-white shadow-sm">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Email Address</th>
                                <th className="px-4 py-3">Lastname</th>
                                <th className="px-4 py-3">Firstname</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created At</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.users?.map((element, index) => (
                                <tr
                                    key={element._id}
                                    className={`border-b border-gray-300 hover:bg-red-50 transition-all duration-300 ${
                                        index % 2 === 0 ? 'bg-gray-100' : ''
                                    }`}
                                >
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="py-2 px-4">
                                        {editElement?._id === element._id ? (
                                            <InputForm
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                id={'email'}
                                                validate={{
                                                    required: 'Require fill',
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: 'Invalid email address',
                                                    },
                                                }}
                                                defaultValue={editElement?.email}
                                            />
                                        ) : (
                                            <span>{element.email}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editElement?._id === element._id ? (
                                            <InputForm
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                id={'lastname'}
                                                validate={{ required: 'Require fill' }}
                                                defaultValue={editElement?.lastname}
                                            />
                                        ) : (
                                            <span>{element.lastname}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editElement?._id === element._id ? (
                                            <InputForm
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                id={'firstname'}
                                                validate={{ required: 'Require fill' }}
                                                defaultValue={editElement?.firstname}
                                            />
                                        ) : (
                                            <span>{element.firstname}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editElement?._id === element._id ? (
                                            <Select
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                id={'role'}
                                                validate={{ required: 'Require fill' }}
                                                defaultValue={+element.role}
                                                options={role}
                                            />
                                        ) : (
                                            <span>{role.find((role) => +role.code === +element.role)?.value}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editElement?._id === element._id ? (
                                            <InputForm
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                id={'mobile'}
                                                validate={{
                                                    required: 'Require fill',
                                                    pattern: {
                                                        value: /^[62|0]+\d{9}/gi,
                                                        message: 'Invalid phone number',
                                                    },
                                                }}
                                                defaultValue={editElement?.mobile}
                                            />
                                        ) : (
                                            <span>{element.mobile}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editElement?._id === element._id ? (
                                            <Select
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                id={'isBlocked'}
                                                validate={{ required: 'Require fill' }}
                                                defaultValue={element.isBlocked}
                                                options={blockStatus}
                                            />
                                        ) : (
                                            <span
                                                className={`font-semibold ${
                                                    element.isBlocked ? 'text-red-600' : 'text-green-600'
                                                }`}
                                            >
                                                {element.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        {editElement?._id === element._id ? (
                                            <span
                                                onClick={() => setEditElement(null)}
                                                className="px-2 text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-300"
                                            >
                                                Back
                                            </span>
                                        ) : (
                                            <span
                                                onClick={() => setEditElement(element)}
                                                className="px-2 text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-300"
                                            >
                                                Edit
                                            </span>
                                        )}
                                        <span
                                            onClick={() => handleDeleteUser(element._id)}
                                            className="px-2 text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-300"
                                        >
                                            Delete
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>

                {/* Pagination */}
                <div className="w-full flex justify-end mt-6">
                    <Pagination totalCount={users?.counts} />
                </div>
            </div>
        </div>
    );
};

export default memo(ManageUsers);
