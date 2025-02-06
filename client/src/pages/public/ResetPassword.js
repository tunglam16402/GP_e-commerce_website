import React, { useState } from 'react';
import { Button } from '../../components';
import { useParams } from 'react-router-dom';
import { apiResetPassword } from '../../apis/user';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const { token } = useParams();

    const handlerResetPassword = async () => {
        const response = await apiResetPassword({ password, token });
        if (response.success) {
            toast.success(response.message, { theme: 'colored' });
        } else {
            toast.info(response.message, { theme: 'colored' });
        }
    };
    return (
        <main
            id="content"
            role="main"
            className="w-full absolute bg-white top-0 left-0 bottom-0 right-0 flex justify-center  p-6 z-50"
        >
            <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300 animate-slide-right">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Reset password</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Please enter your new password to reset your password.
                        </p>
                    </div>

                    <div className="mt-5">
                        <form>
                            <div className="grid gap-y-4">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-bold ml-1 mb-2 dark:text-white "
                                    >
                                        New password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 
                                                    shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-main focus:border-main focus:z-10 sm:text-sm placeholder:italic"
                                            required
                                            placeholder="Type your new password here"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            aria-describedby="password-error"
                                        />
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="password-error">
                                        Please include a valid email address so we can get back to you
                                    </p>
                                </div>
                                <Button  handleOnclick={handlerResetPassword} fullWidth>Submit</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ResetPassword;
