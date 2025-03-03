import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from 'apis/user';
import { InputField, Button, Loading, GoogleLoginButton } from 'components';
import path from 'utils/path';
import { login } from 'store/users/userSlice';
import { validate } from 'utils/helper';
import { showModal } from 'store/app/appSlice';

const Authentication = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [payload, setPayload] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        password: '',
    });
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [inValidFields, setInValidFields] = useState([]);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [isVerifyEmail, setIsVerifyEmail] = useState(false);
    const [searchParams] = useSearchParams();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { current } = useSelector((state) => state.user);

    const resetPayload = () => {
        setPayload({
            firstname: '',
            lastname: '',
            email: '',
            mobile: '',
            password: '',
        });
    };

    const handlerForgotPassword = async () => {
        const response = await apiForgotPassword({ email });
        console.log(response);
        if (response.success) {
            toast.success(response.message, { theme: 'colored' });
        } else {
            toast.info(response.message, { theme: 'colored' });
        }
    };

    useEffect(() => {
        resetPayload();
    }, [isRegister]);
    //submit
    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, mobile, ...data } = payload;
        // if (isRegister && payload.password !== confirmPassword) {
        //     setPasswordError('Passwords do not match!');
        //     return;
        // } else {
        //     setPasswordError('');
        // }

        const invalids = isRegister ? validate(payload, setInValidFields) : validate(data, setInValidFields);
        if (invalids === 0) {
            if (isRegister) {
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
                const registerResponse = await apiRegister(payload);
                dispatch(showModal({ isShowModal: false, modalChildren: null }));
                if (registerResponse.success) {
                    setIsVerifyEmail(true);
                } else {
                    Swal.fire('Oops!', registerResponse.message, 'error');
                }
            } else {
                const loginResponse = await apiLogin(data);
                // if (loginResponse.success) {
                //     dispatch(
                //         login({ isLoggedIn: true, token: loginResponse.accessToken, userData: loginResponse.userData }),
                //     );
                //     searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`);
                // } else {
                //     Swal.fire('Oops!', loginResponse.message, 'error');
                // }
                if (loginResponse.success) {
                    dispatch(
                        login({ isLoggedIn: true, token: loginResponse.accessToken, userData: loginResponse.userData }),
                    );
                    console.log('Login successful, waiting for current update...');
                } else {
                    Swal.fire('Oops!', loginResponse.message, 'error');
                }
            }
        }
    }, [payload, isRegister]);

    useEffect(() => {
        if (current?.role) {
            console.log('Auto navigating:', current.role);
            const redirectPath = searchParams.get('redirect');
            if (redirectPath) {
                navigate(redirectPath);
            } else {
                if (current.role === 2006) {
                    navigate(`/${path.HOME}`);
                } else {
                    navigate(`/${path.ADMIN}/${path.DASHBOARD}`);
                }
            }
        }
    }, [current, navigate]);

    const handleFinalRegister = async () => {
        const response = await apiFinalRegister(token);
        if (response.success === true) {
            Swal.fire('Congratulation', response.message, 'success').then(() => {
                setIsRegister(false);
                resetPayload();
            });
        } else {
            Swal.fire('Oops!', response.message, 'error');
        }
        setIsVerifyEmail(false);
        setToken('');
    };

    return (
        <div className="w-full relative">
            {isVerifyEmail && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay flex flex-col items-center justify-center z-50">
                    <div className="bg-white w-[800px] rounded-md p-8">
                        <h4 className="text-[26px] mb-8 flex justify-center">Verify your email</h4>
                        <p>
                            We have sent a code to email <strong>{email}</strong>. Please check and enter the
                            verification code in the box below to complete your account registration. Code will expire
                            in 5 minutes
                        </p>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="p-2 mt-4 mb-4 border border-gray-700 rounded-md outline-main"
                        ></input>
                        <Button handleOnclick={handleFinalRegister}>Submit</Button>
                    </div>
                </div>
            )}
            {isForgotPassword && (
                <main
                    id="content"
                    role="main"
                    className=" bg-overlay flex justify-center items-center z-50  fixed inset-0 m-auto backdrop-blur-sm"
                >
                    <div className="mt-7 bg-white  rounded-xl shadow-lg  p-6 w-[800px] animate-slide-right">
                        <div className="p-4 sm:p-7">
                            <div className="text-center">
                                <h1 className="block text-[28px] mb-8 font-bold text-gray-800 ">Forgot password?</h1>
                                <p className="mt-2 text-[16px] text-gray-700 dark:text-gray-600">
                                    Please enter the email address you registered with us to create a new password. We
                                    will send an email to the email address provided and require verification before you
                                    can create a new password.
                                </p>
                                <p className="mt-2 text-[16px] gap-2 text-gray-700 dark:text-gray-600">
                                    Remember your password?
                                    <span
                                        onClick={() => setIsForgotPassword(false)}
                                        className="text-main decoration-2 hover:underline font-medium cursor-pointer"
                                    >
                                        Login here
                                    </span>
                                </p>
                            </div>

                            <div className="mt-8">
                                <form>
                                    <div className="grid gap-y-4">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                                            >
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 
                                                shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-main focus:border-main focus:z-10 sm:text-sm placeholder:italic"
                                                    required
                                                    placeholder="Eg: getpassword@email.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    aria-describedby="email-error"
                                                />
                                            </div>
                                            <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                                                Please include a valid email address so we can get back to you
                                            </p>
                                        </div>
                                        <Button handleOnclick={handlerForgotPassword} fullWidth>
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            )}
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-[100px] text-center text-3xl font-semibold text-gray-900">
                        {isRegister ? 'Register your account' : 'Login to your account'}
                    </h2>
                    {!isRegister && (
                        <p className="mt-2 text-center text-sm text-gray-600 max-w">
                            <span className="mr-2">Don't have an account?</span>
                            <span
                                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                                onClick={() => setIsRegister(true)}
                            >
                                Create account
                            </span>
                        </p>
                    )}
                    {isRegister && (
                        <p className="mt-2 text-center text-sm text-gray-600 max-w">
                            <span className="mr-2">Already have an account?</span>
                            <span
                                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                                onClick={() => setIsRegister(false)}
                            >
                                Go to login
                            </span>
                        </p>
                    )}
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" action="/" method="POST">
                            {isRegister && (
                                <>
                                    <InputField
                                        value={payload.firstname}
                                        setValue={setPayload}
                                        nameKey="firstname"
                                        type="text"
                                        inValidFields={inValidFields}
                                        setInvalidFields={setInValidFields}
                                    ></InputField>

                                    <InputField
                                        value={payload.lastname}
                                        setValue={setPayload}
                                        nameKey="lastname"
                                        type="text"
                                        inValidFields={inValidFields}
                                        setInvalidFields={setInValidFields}
                                    ></InputField>

                                    <InputField
                                        value={payload.mobile}
                                        setValue={setPayload}
                                        nameKey="mobile"
                                        type="mobile"
                                        inValidFields={inValidFields}
                                        setInvalidFields={setInValidFields}
                                    ></InputField>
                                </>
                            )}

                            <InputField
                                value={payload.email}
                                setValue={setPayload}
                                nameKey="email"
                                type="email"
                                autocomplete="email"
                                inValidFields={inValidFields}
                                setInvalidFields={setInValidFields}
                            ></InputField>

                            <InputField
                                value={payload.password}
                                setValue={setPayload}
                                nameKey="password"
                                type="password"
                                inValidFields={inValidFields}
                                setInvalidFields={setInValidFields}
                            ></InputField>
                            {isRegister && (
                                <InputField
                                    value={confirmPassword}
                                    setValue={({ password }) => setConfirmPassword(password)}
                                    nameKey="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    inValidFields={passwordError ? ['confirmPassword'] : []}
                                    setInvalidFields={() => setPasswordError('')}
                                />
                            )}
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

                            {!isRegister && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember_me"
                                            name="remember_me"
                                            type="checkbox"
                                            className="h-4 w-4 text-main focus:ring-main border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                                            Remember me
                                        </label>
                                    </div>

                                    <div
                                        onClick={() => setIsForgotPassword(true)}
                                        className="font-medium text-sm text-main hover:text-blue-500 cursor-pointer"
                                    >
                                        Forgot your password?
                                    </div>
                                </div>
                            )}
                            <div>
                                <Button handleOnclick={handleSubmit} fullWidth>
                                    {isRegister ? 'Register' : 'Login  '}
                                </Button>
                            </div>
                        </form>
                        {!isRegister && (
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-gray-100 text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-center px-4">
                                    <GoogleLoginButton />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Authentication;
