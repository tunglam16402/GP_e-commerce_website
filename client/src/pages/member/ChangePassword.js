import { Button, InputForm } from 'components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiChangePassword } from 'apis';
import withBaseComponent from 'hocs/withBaseComponent';

const ChangePassword = ({ navigate }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        reset,
    } = useForm();
    const { current } = useSelector((state) => state.user);

    const handleChangePassword = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const response = await apiChangePassword(data, token);
            if (response.success) {
                toast.success('Password updated successfully!');
                reset();
                navigate('/profile');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating password');
        }
    };

    return (
        <div className="w-full px-4">
            <header className="text-4xl font-bold py-6 text-red-600 border-b-4 border-red-400 shadow-md">
                Change Password
            </header>

            <form
                onSubmit={handleSubmit(handleChangePassword)}
                className="w-1/2 mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg flex flex-col gap-6"
            >
                <InputForm
                    label="Current Password"
                    register={register}
                    errors={errors}
                    id="oldPassword"
                    type="password"
                    validate={{ required: 'Current password is required' }}
                    fullWidth
                />
                <InputForm
                    label="New Password"
                    register={register}
                    errors={errors}
                    id="newPassword"
                    type="password"
                    validate={{
                        required: 'New password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    }}
                    fullWidth
                />
                <InputForm
                    label="Confirm New Password"
                    register={register}
                    errors={errors}
                    id="confirmPassword"
                    type="password"
                    validate={{
                        required: 'Please confirm your new password',
                        validate: (value) => value === watch('newPassword') || 'Passwords do not match',
                    }}
                    fullWidth
                />
                <div className="w-full flex justify-end">
                    <Button
                        type="submit"
                        className="px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                    >
                        Update Password
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default withBaseComponent(ChangePassword);
