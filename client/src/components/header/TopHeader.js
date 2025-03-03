import React, { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import path from 'utils/path';
import { getCurrent } from 'store/users/asyncAction';
import { useSelector } from 'react-redux';
import icons from 'utils/icons';
import { logout, clearMessage } from 'store/users/userSlice';
import Swal from 'sweetalert2';
import { RiPhoneFill } from 'react-icons/ri';
import withBaseComponent from 'hocs/withBaseComponent';
import { useTranslation } from 'react-i18next';

const { IoLogOutSharp } = icons;

const TopHeader = ({ dispatch, navigate, location }) => {
    const { i18n } = useTranslation();
    const isLoginPage = location.pathname === `/${path.AUTH}`;
    const { isLoggedIn, current, message } = useSelector((state) => state.user);

    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) {
                dispatch(getCurrent());
            }
        }, 300);
        return () => {
            clearTimeout(setTimeoutId);
        };
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (message) {
            Swal.fire('Oops!', message, 'info').then(() => {
                dispatch(clearMessage());
                navigate(`/${path.AUTH}`);
            });
        }
    }, [message]);

    const handleLogout = () => {
        dispatch(logout());
        navigate(`/${path.AUTH}`);
    };

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang); // Lưu ngôn ngữ vào localStorage
    };
    return (
        <div className=" w-full bg-main flex items-center justify-center">
            <div className="w-main h-[40px] flex items-center justify-between text-sm text-white ">
                <span className="flex items-center gap-2">
                    ORDER ONLINE OR CALL US
                    <a href="tel:+012345678" className=" flex items-center underline hover:opacity-80 border-r px-2">
                        <span className="">
                            <RiPhoneFill></RiPhoneFill>
                        </span>
                        (+84)012345678
                    </a>
                    <span className="">Mon-Sat 9:00AM - 8:00PM</span>
                </span>

                {isLoggedIn && current ? (
                    <div className="flex gap-4 text-sm items-center">
                        <div className="flex items-center gap-4">
                            <select
                                className=" py-1 border-r text-white bg-main rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={i18n.language}
                                onChange={(e) => handleChangeLanguage(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="vi">Tiếng Việt</option>
                            </select>
                        </div>
                        {current ? (
                            <span>{`Welcome, ${current.lastname} ${current.firstname}`}</span>
                        ) : (
                            <span>Loading...</span>
                        )}
                        <span
                            onClick={handleLogout}
                            className="text-[22px] hover:rounded-full hover:bg-gray-200 hover:text-main p-1 cursor-pointer"
                        >
                            <IoLogOutSharp></IoLogOutSharp>
                        </span>
                    </div>
                ) : (
                    <Link to={`/${path.AUTH}`} className="hover:text-gray-800">
                        Sign In or Create Account
                    </Link>
                )}
            </div>
        </div>
    );
};

export default withBaseComponent(memo(TopHeader));
