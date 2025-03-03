import { apiUpdateCurrent } from 'apis';
import Button from 'components/buttons/Button';
import withBaseComponent from 'hocs/withBaseComponent';
import { Search, UserCircle } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Navigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrent } from 'store/users/asyncAction';
import { logout } from 'store/users/userSlice';
import avatarDefault from 'assets/img/avt_default.png';
import InputForm from 'components/inputs/InputForm';
import clsx from 'clsx';

const AdminHeader = ({ dispatch }) => {
    const {
        register,
        formState: { errors, isDirty },
        handleSubmit,
        reset,
    } = useForm();
    const { current } = useSelector((state) => state.user);
    const [searchParams] = useSearchParams();

    const [isShowOption, setIsShowOption] = useState(false);
    const [isShowModal, setIsShowModal] = useState(false);

    useEffect(() => {
        const handleClickOutOptions = (e) => {
            const avatar = document.getElementById('avatar');
            if (!avatar?.contains(e.target)) setIsShowOption(false);
        };
        document.addEventListener('click', handleClickOutOptions);

        return () => {
            document.removeEventListener('click', handleClickOutOptions);
        };
    }, []);

    useEffect(() => {
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
        });
    }, [current]);

    const handleUpdateInfo = async (data) => {
        const formData = new FormData();
        if (data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0]);
        }
        delete data.avatar;
        for (let i of Object.entries(data)) {
            formData.append(i[0], i[1]);
        }

        const response = await apiUpdateCurrent(formData);
        if (response.success) {
            dispatch(getCurrent());
            toast.success(response.message);
            if (searchParams?.get('redirect')) {
                Navigate(searchParams.get('redirect'));
            }
        } else toast.error(response.message);
    };

    return (
        <>
            {/* HEADER */}
            <div className="flex items-center justify-between bg-white shadow-lg px-6 py-4 h-[60px] rounded-lg">
                {/* Thanh tìm kiếm */}
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-[400px] shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
                    <Search className="text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none px-4 w-full text-gray-700 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                    />
                </div>

                {/* Quản lý tài khoản */}
                <div
                    className="cursor-pointer flex items-center gap-3 text-lg font-semibold text-gray-700 relative hover:text-gray-900 transition-all duration-200"
                    onClick={() => setIsShowOption((prev) => !prev)}
                    id="avatar"
                >
                    <img
                        src={current?.avatar || avatarDefault}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md transform transition-all duration-300 hover:scale-110 hover:border-blue-500"
                    />
                    <span className="hover:text-main">
                        {current?.lastname} {current?.firstname}
                    </span>
                    {isShowOption && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-full right-0 flex flex-col bg-white shadow-lg py-2 border rounded-lg min-w-[180px] mt-2 transition-all duration-200 ease-in-out opacity-100"
                        >
                            <span
                                className="p-2 w-full hover:bg-gray-100 border-b-2 cursor-pointer transition-colors duration-200 ease-in-out"
                                onClick={() => setIsShowModal(true)}
                            >
                                Personal
                            </span>
                            <span
                                onClick={() => dispatch(logout())}
                                className="p-2 w-full hover:bg-gray-100 cursor-pointer transition-colors duration-200 ease-in-out"
                            >
                                Logout
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {isShowModal && (
                <div className="fixed top-0 left-[280px] w-[calc(100%-280px)] h-full flex items-center justify-center z-50 bg-white">
                    <div className="bg-gray-100 w-full h-full p-6 relative border shadow-lg rounded-lg">
                        {/* Header */}
                        <header className="text-4xl font-bold py-6 text-red-600 border-b-4 border-red-400 ">
                            Personal Information
                        </header>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit(handleUpdateInfo)}
                            className="mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg flex gap-10"
                        >
                            {/* Left Column: Input Fields */}
                            <div className="w-2/3 flex flex-col gap-6">
                                {[
                                    { label: 'First Name', id: 'firstname' },
                                    { label: 'Last Name', id: 'lastname' },
                                    {
                                        label: 'Email Address',
                                        id: 'email',
                                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    },
                                    {
                                        label: 'Phone Number',
                                        id: 'mobile',
                                        pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\ .]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                                    },
                                ].map((field) => (
                                    <InputForm
                                        key={field.id}
                                        label={field.label}
                                        register={register}
                                        errors={errors}
                                        id={field.id}
                                        validate={{
                                            required: `${field.label} is required`,
                                            ...(field.pattern && {
                                                pattern: {
                                                    value: field.pattern,
                                                    message: `${field.label} is invalid`,
                                                },
                                            }),
                                        }}
                                        fullWidth
                                    />
                                ))}

                                {/* Created At */}
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-700">Created At:</span>
                                    <span className="text-gray-500">{moment(current?.createdAt).fromNow()}</span>
                                </div>
                            </div>

                            {/* Right Column: Avatar & Status */}
                            <div className="w-1/3 flex flex-col items-center gap-6">
                                {/* Profile Image */}
                                <div className="flex flex-col items-center gap-4">
                                    <span className="font-medium text-gray-700">Profile Image:</span>
                                    <label htmlFor="file" className="relative group cursor-pointer">
                                        <img
                                            src={current?.avatar || avatarDefault}
                                            alt="avatar"
                                            className="w-36 h-36 rounded-full border-4 border-gray-200 shadow-lg group-hover:border-red-500 group-hover:shadow-xl transition-all duration-300"
                                        />
                                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Change
                                        </span>
                                    </label>
                                    <input type="file" id="file" {...register('avatar')} hidden />
                                </div>

                                {/* Account Status */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="font-medium text-gray-700">Account Status:</span>
                                    <span
                                        className={clsx(
                                            'font-semibold text-sm px-3 py-1 rounded-full',
                                            current?.isBlocked
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-green-100 text-green-600',
                                        )}
                                    >
                                        {current?.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </form>

                        {/* Sticky Update Button */}
                        {isDirty && (
                            <div className="sticky bottom-4 w-full flex justify-end px-8">
                                <Button
                                    type="submit"
                                    className="px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                                >
                                    Update Information
                                </Button>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setIsShowModal(false)}
                            className="absolute top-8 right-6 text-[40px] font-bold text-main hover:text-black"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default withBaseComponent(AdminHeader);
