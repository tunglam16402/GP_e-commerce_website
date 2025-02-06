import { Button, InputForm } from 'components';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import avatarDefault from 'assets/img/avt_default.png';
import { apiUpdateCurrent } from 'apis';
import { getCurrent } from 'store/users/asyncAction';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import withBaseComponent from 'hocs/withBaseComponent';
import clsx from 'clsx';

const Personal = ({ dispatch, navigate }) => {
    const {
        register,
        formState: { errors, isDirty },
        handleSubmit,
        reset,
    } = useForm();
    const { current } = useSelector((state) => state.user);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
            address: current?.address,
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
                navigate(searchParams.get('redirect'));
            }
        } else toast.error(response.message);
    };

    return (
        // <div className="w-full relative px-4">
        //     <header className="text-3xl font-semibold py-4 border-b border-main">Personal</header>
        //     <form onSubmit={handleSubmit(handleUpdateInfo)} className="w-3/5 mx-auto py-8 flex flex-col gap-4">
        //         <InputForm
        //             label="First name"
        //             register={register}
        //             errors={errors}
        //             id="firstname"
        //             validate={{
        //                 required: 'Need fill this fields',
        //             }}
        //             fullWidth
        //         />
        //         <InputForm
        //             label="last name"
        //             register={register}
        //             errors={errors}
        //             id="lastname"
        //             validate={{
        //                 required: 'Need fill this fields',
        //             }}
        //             fullWidth
        //         />
        //         <InputForm
        //             label="Email address"
        //             register={register}
        //             errors={errors}
        //             id="email"
        //             validate={{
        //                 required: 'Need fill this fields',
        //                 pattern: {
        //                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        //                     message: 'Email invalid.',
        //                 },
        //             }}
        //             fullWidth
        //         />
        //         <InputForm
        //             label="Phone number"
        //             register={register}
        //             errors={errors}
        //             id="mobile"
        //             validate={{
        //                 required: 'Need fill this fields',
        //                 pattern: {
        //                     value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\ .]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
        //                     message: 'Phone invalid.',
        //                 },
        //             }}
        //             fullWidth
        //         />
        //         <InputForm
        //             label="Shipping address"
        //             register={register}
        //             errors={errors}
        //             id="address"
        //             validate={{
        //                 required: 'Need fill this fields',
        //             }}
        //             fullWidth
        //         />
        //         <div className="flex items-center gap-2">
        //             <span className="font-medium">Account status:</span>
        //             <span>{current?.isBlocked ? 'Blocked' : 'Actived'}</span>
        //         </div>
        //         <div className="flex items-center gap-2">
        //             <span className="font-medium">Role:</span>
        //             <span>{+current?.role === 2002 ? 'Admin' : 'User'}</span>
        //         </div>
        //         <div className="flex items-center gap-2">
        //             <span className="font-medium">Created At:</span>
        //             <span>{moment(current?.createdAt).fromNow()}</span>
        //         </div>
        //         <div className="flex flex-col gap-2">
        //             <span className="font-medium">Profile image:</span>
        //             <label htmlFor="file">
        //                 <img
        //                     src={current?.avatar || avatarDefault}
        //                     alt="avatar"
        //                     className="w-24 h-24 ml-8 object-cover rounded-full"
        //                 ></img>
        //             </label>
        //             <input type="file" id="file" {...register('avatar')} hidden></input>
        //         </div>
        //         {isDirty && (
        //             <div className="w-full flex justify-end">
        //                 <Button type="submit">Update information</Button>
        //             </div>
        //         )}
        //     </form>
        // </div>
        // <div className="w-full relative px-4">
        //     {/* Header */}
        //     <header className="text-4xl font-bold py-6 text-red-600 border-b-4 border-red-400 shadow-md">
        //         Personal Information
        //     </header>

        //     {/* Form */}
        //     <form
        //         onSubmit={handleSubmit(handleUpdateInfo)}
        //         className="w-4/5 mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg flex flex-col gap-6"
        //     >
        //         {/* Input fields */}
        //         <InputForm
        //             label="First Name"
        //             register={register}
        //             errors={errors}
        //             id="firstname"
        //             validate={{ required: 'This field is required' }}
        //             fullWidth
        //         />
        //         <InputForm
        //             label="Last Name"
        //             register={register}
        //             errors={errors}
        //             id="lastname"
        //             validate={{ required: 'This field is required' }}
        //             fullWidth
        //         />
        //         <InputForm
        //             label="Email Address"
        //             register={register}
        //             errors={errors}
        //             id="email"
        //             validate={{
        //                 required: 'This field is required',
        //                 pattern: {
        //                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        //                     message: 'Invalid email format',
        //                 },
        //             }}
        //             fullWidth
        //         />
        //         <InputForm
        //             label="Phone Number"
        //             register={register}
        //             errors={errors}
        //             id="mobile"
        //             validate={{
        //                 required: 'This field is required',
        //                 pattern: {
        //                     value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\ .]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
        //                     message: 'Invalid phone number format',
        //                 },
        //             }}
        //             fullWidth
        //         />
        //         <InputForm
        //             label="Shipping Address"
        //             register={register}
        //             errors={errors}
        //             id="address"
        //             validate={{ required: 'This field is required' }}
        //             fullWidth
        //         />

        //         {/* Account Status */}
        //         <div className="flex items-center gap-3">
        //             <span className="font-medium text-gray-700">Account Status:</span>
        //             <span className={clsx('font-semibold', current?.isBlocked ? 'text-red-600' : 'text-green-600')}>
        //                 {current?.isBlocked ? 'Blocked' : 'Active'}
        //             </span>
        //         </div>

        //         {/* Role */}
        //         <div className="flex items-center gap-3">
        //             <span className="font-medium text-gray-700">Role:</span>
        //             <span className="font-semibold text-blue-500">{+current?.role === 2002 ? 'Admin' : 'User'}</span>
        //         </div>

        //         {/* Created At */}
        //         <div className="flex items-center gap-3">
        //             <span className="font-medium text-gray-700">Created At:</span>
        //             <span className="text-gray-500">{moment(current?.createdAt).fromNow()}</span>
        //         </div>

        //         {/* Profile Image */}
        //         <div className="flex flex-col items-center gap-4">
        //             <span className="font-medium text-gray-700">Profile Image:</span>
        //             <label htmlFor="file" className="relative group cursor-pointer">
        //                 <img
        //                     src={current?.avatar || avatarDefault}
        //                     alt="avatar"
        //                     className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-lg group-hover:border-red-500 group-hover:shadow-xl transition-all duration-300"
        //                 />
        //                 <span className="absolute bottom-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        //                     Change
        //                 </span>
        //             </label>
        //             <input type="file" id="file" {...register('avatar')} hidden />
        //         </div>

        //         {/* Update Button */}
        //         {isDirty && (
        //             <div className="w-full flex justify-end mt-4">
        //                 <Button
        //                     type="submit"
        //                     className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300"
        //                 >
        //                     Update Information
        //                 </Button>
        //             </div>
        //         )}
        //     </form>
        // </div>
        <div className="w-full relative px-4">
            {/* Header */}
            <header className="text-4xl font-bold py-6 text-red-600 border-b-4 border-red-400 shadow-md">
                Personal Information
            </header>

            {/* Form */}
            <form
                onSubmit={handleSubmit(handleUpdateInfo)}
                className="w-4/5 mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg flex flex-col gap-6"
            >
                {/* Input fields */}
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
                    { label: 'Shipping Address', id: 'address' },
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

                {/* Account Status */}
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">Account Status:</span>
                    <span
                        className={clsx(
                            'font-semibold text-sm px-2 py-1 rounded-full',
                            current?.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600',
                        )}
                    >
                        {current?.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                </div>

                {/* Role */}
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="font-semibold text-blue-500">{+current?.role === 2002 ? 'Admin' : 'User'}</span>
                </div>

                {/* Created At */}
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">Created At:</span>
                    <span className="text-gray-500">{moment(current?.createdAt).fromNow()}</span>
                </div>

                {/* Profile Image */}
                <div className="flex flex-col items-center gap-4">
                    <span className="font-medium text-gray-700">Profile Image:</span>
                    <label htmlFor="file" className="relative group cursor-pointer">
                        <img
                            src={current?.avatar || avatarDefault}
                            alt="avatar"
                            className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-lg group-hover:border-red-500 group-hover:shadow-xl transition-all duration-300"
                        />
                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Change
                        </span>
                    </label>
                    <input type="file" id="file" {...register('avatar')} hidden />
                </div>

                {/* Update Button - Fixed */}
                {isDirty && (
                    <>
                        {/* Sticky Update Button */}
                        <div className="sticky bottom-4 w-full flex justify-end">
                            <Button
                                type="submit"
                                className="px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                            >
                                Update Information
                            </Button>
                        </div>

                        {/* Optional Alert Text */}
                        <div className="text-right text-gray-500 mt-2">
                            <small>Don't forget to save your changes!</small>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default withBaseComponent(Personal);
