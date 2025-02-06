import React, { memo, useEffect } from 'react';
import { createSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import logo from 'assets/img/logo.png';
import icons from 'utils/icons';
import path from 'utils/path';
import { useState } from 'react';
import { logout } from 'store/users/userSlice';
import withBaseComponent from 'hocs/withBaseComponent';
import { showCart } from 'store/app/appSlice';
import { useForm } from 'react-hook-form';
import useDebounce from 'hooks/useDebounce';
import InputForm from 'components/inputs/InputForm';
import { FaSearch } from 'react-icons/fa';

const { RiPhoneFill, GrMail, FaShoppingCart, FaUser } = icons;

const Header = ({ dispatch, navigate, location }) => {
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useForm();
    const { current } = useSelector((state) => state.user);
    const [isShowOption, setIsShowOption] = useState(false);

    // const queriesDebounce = useDebounce(watch('q'), 800);

    // useEffect(() => {
    //     if (queriesDebounce?.trim()) {
    //         const searchKeyword = encodeURIComponent(queriesDebounce.trim());

    //         navigate(`/${searchKeyword}?q=${searchKeyword}`, { replace: false }); // Sử dụng replace: false (mặc định)
    //     }
    // }, [queriesDebounce, navigate]);
    const queries = watch('q');

    const handleSearchClick = () => {
        if (queries?.trim()) {
            setValue('q', '');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && queries?.trim()) {
            const searchKeyword = queries.trim();
            let category = '';
            if (searchKeyword.toLowerCase().includes('smartphone')) {
                category = 'smartphone';
            } else if (searchKeyword.toLowerCase().includes('laptop')) {
                category = 'laptop';
            } else {
                category = 'products';
            }

            // Chuyển hướng đến URL có category và từ khóa tìm kiếm
            navigate(`/${category}?q=${encodeURIComponent(searchKeyword)}`, { replace: false });
        }
    };

    //handle when click out after click mouse some effect
    useEffect(() => {
        const handleClickOutOptions = (e) => {
            const profile = document.getElementById('profile');
            if (!profile?.contains(e.target)) setIsShowOption(false);
        };
        document.addEventListener('click', handleClickOutOptions);

        return () => {
            document.removeEventListener('click', handleClickOutOptions);
        };
    }, []);

    return (
        <div className="w-full flex items-center justify-center bg-white fixed top-[40px] left-0 right-0 z-40">
            <div className="w-main flex justify-between items-center h-[110px] py-[35px]">
                <Link to={`/${path.HOME}`}>
                    <img src={logo} alt="logo" className="w-[234px] object-contain" />
                </Link>
                <div className="flex">
                    <div className="flex flex-col w-[440px]">
                        <div className="relative">
                            <InputForm
                                id="q"
                                onKeyDown={handleKeyDown}
                                onClick={handleSearchClick}
                                register={register}
                                errors={errors}
                                fullWidth
                                placeholder="What product are you looking for? "
                                style="rounded-2xl focus:ring-2 focus:ring-main focus:outline-none transition-all duration-200"
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>

                    <div className="flex flex-col px-6 border-r items-center justify-center text-[12px]">
                        <span className="flex gap-4 items-center">
                            <GrMail color="red"></GrMail>
                            <span className="font-semibold"> gpecommerce@gmail.com</span>
                        </span>
                        <span>Online Support 24/7</span>
                    </div>
                    {current && (
                        <>
                            <div
                                onClick={() => dispatch(showCart())}
                                className="cursor-pointer flex px-6 border-r items-center justify-center gap-2 text-[16px]"
                            >
                                <FaShoppingCart color="red"></FaShoppingCart>
                                <span>{`${current?.cart?.length || 0} item(s)`}</span>
                            </div>
                            <div
                                className="cursor-pointer flex px-6 items-center justify-center gap-2 text-[16px] relative"
                                onClick={() => setIsShowOption((prev) => !prev)}
                                id="profile"
                            >
                                <FaUser color="red"></FaUser>
                                <span>Profile</span>
                                {isShowOption && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-full left-4 flex flex-col bg-white shadow-md py-2 border min-w-[180px]"
                                    >
                                        <Link
                                            className="p-2 w-full hover:bg-gray-100 border-b-2"
                                            to={`/${path.MEMBER}/${path.PERSONAL}`}
                                        >
                                            Personal
                                        </Link>
                                        {+current?.role === 2002 && (
                                            <Link
                                                className="p-2 w-full hover:bg-gray-100"
                                                to={`/${path.ADMIN}/${path.DASHBOARD}`}
                                            >
                                                Admin workspace
                                            </Link>
                                        )}
                                        <span
                                            onClick={() => dispatch(logout())}
                                            className="p-2 w-full hover:bg-gray-100"
                                        >
                                            Logout
                                        </span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(Header));
