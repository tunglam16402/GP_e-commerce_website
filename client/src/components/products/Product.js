import React, { memo, useState } from 'react';
import { formatMoney } from 'utils/helper';
import label1 from 'assets/img/label1.png';
import labelBlue from 'assets/img/label_blue.png';
import { renderStarFromNumber } from 'utils/helper';
import { SelectOption } from 'components';
import icons from 'utils/icons';
import { createSearchParams, Link } from 'react-router-dom';
import withBaseComponent from 'hocs/withBaseComponent';
import { DetailProduct } from 'pages/public';
import { showModal } from 'store/app/appSlice';
import { apiUpdateCart, apiUpdateWishlist } from 'apis';
import { toast } from 'react-toastify';
import { getCurrent } from 'store/users/asyncAction';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import path from 'utils/path';
import clsx from 'clsx';

const { BsFillSuitHeartFill, AiFillEye, FaCartPlus, BsFillCartCheckFill } = icons;

const Product = ({
    productData,
    isNew,
    normal,
    navigate,
    dispatch,
    location,
    pid,
    className,
    imageWidth = 274,
    imageHeight = 274,
}) => {
    const [isShowOption, setIsShowOption] = useState(false);
    const { current } = useSelector((state) => state.user);

    const handleClickOptions = async (e, flag) => {
        e.stopPropagation();
        if (flag === 'CART') {
            if (!current) {
                Swal.fire({
                    title: 'Almost...',
                    text: 'Your must login first to buy this',
                    cancelButtonText: 'Not now',
                    confirmButtonText: 'Go login',
                    icon: 'info',
                    showCancelButton: true,
                }).then(async (response) => {
                    if (response.isConfirmed) {
                        navigate({
                            pathname: `/${path.AUTH}`,
                            search: createSearchParams({ redirect: location.pathname }).toString(),
                        });
                    }
                });
            }
            const finalPrice = productData?.discountPrice > 0 ? productData.discountPrice : productData?.price;

            const response = await apiUpdateCart({
                pid: productData?._id,
                color: productData?.color,
                quantity: 1,
                price: finalPrice,
                thumb: productData?.thumb,
                title: productData?.title,
            });
            if (response.success) {
                toast.success(response.message);
                dispatch(getCurrent());
            } else toast.error(response.message);
        }
        if (flag === 'WISHLIST') {
            const response = await apiUpdateWishlist(pid);
            if (response.success) {
                dispatch(getCurrent());
                // toast.success(response.message);
            } else toast.error(response.message);
        }
        if (flag === 'QUICK_VIEW') {
            dispatch(
                showModal({
                    isShowModal: true,
                    modalChildren: (
                        <DetailProduct data={{ pid: productData?._id, category: productData?.category }} isQuickView />
                    ),
                }),
            );
        }
    };

    return (
        <div
            className={clsx(
                'w-full text-base px-[10px] cursor-pointer hover:shadow-xl transition-all duration-300',
                className,
            )}
        >
            <div
                className="w-full border p-[15px] flex flex-col items-center"
                onClick={(e) =>
                    navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)
                }
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    setIsShowOption(true);
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();
                    setIsShowOption(false);
                }}
            >
                <div className="w-full relative">
                    {isShowOption && (
                        <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
                            <span title="Quick view" onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}>
                                <SelectOption icons={<AiFillEye size={24} />}></SelectOption>
                            </span>
                            {current?.cart?.some((element) => element?.product?._id === productData._id.toString()) ? (
                                <span title="Added to Cart">
                                    <SelectOption
                                        icons={<BsFillCartCheckFill size={24} color="green" />}
                                    ></SelectOption>
                                </span>
                            ) : (
                                <span title="Add to Cart" onClick={(e) => handleClickOptions(e, 'CART')}>
                                    <SelectOption icons={<FaCartPlus size={24} />}></SelectOption>
                                </span>
                            )}
                            <span title="Add to Wishlist" onClick={(e) => handleClickOptions(e, 'WISHLIST')}>
                                <SelectOption
                                    icons={
                                        <BsFillSuitHeartFill
                                            size={22}
                                            color={current?.wishlist?.some((i) => i?._id === pid) ? 'red' : 'gray'}
                                        />
                                    }
                                ></SelectOption>
                            </span>
                        </div>
                    )}
                    <img
                        src={
                            productData?.thumb ||
                            'https://tse3.mm.bing.net/th?id=OIP.uOQ047yW1qXUtl2dpGhwvQHaHa&pid=Api&P=0&h=220'
                        }
                        alt="Product img"
                        style={{
                            width: `${imageWidth}px`,
                            height: `${imageHeight}px`,
                        }}
                        className=" object-cover"
                        // className="w-full object-contain"
                    ></img>
                    {!normal && (
                        <img
                            src={isNew ? label1 : labelBlue}
                            alt=""
                            className="absolute cursor-pointer top-[-15px] left-[-47px] w-[140px] h-[35px] object-cover opacity-85"
                        ></img>
                    )}
                    <span
                        className="before:content-[''] before:w-[6px] before:h-[6px] before:rounded-[6px] 
                    before:bg-white before:absolute before:left-[-12px] before:top-[10px] before:z-[1] 
                    top-[-15px] left-[-8px] absolute text-white "
                    >
                        {isNew ? 'New' : 'Trending'}
                    </span>
                </div>
                <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
                    <span className="line-clamp-1">{productData?.title}</span>
                    <span className="flex h-4">
                        {renderStarFromNumber(productData?.totalRatings)?.map((element, index) => (
                            <span key={index}>{element}</span>
                        ))}
                    </span>
                    {/* <div className="flex flex-col items-start">
                        <div className="flex items-center">
                            {productData?.discount > 0 ? (
                                <>
                                    <span className="text-gray-500 line-through font-semibold mr-2">
                                        {formatMoney(productData?.price)} VNĐ
                                    </span>
                                    <span className="text-red-600 font-semibold mr-2">
                                        -{productData?.discount}% 
                                    </span>
                                </>
                            ) : (
                                <span>{formatMoney(productData?.price)} VNĐ</span>
                            )}
                        </div>
                        {productData?.discountPrice && productData?.discountPrice > 0 && (
                            <span className="text-main text-[24px] py-2 font-semibold">
                                {formatMoney(productData?.discountPrice)} VNĐ
                            </span>
                        )}
                    </div> */}
                    <div className="flex flex-col items-start">
                        <div className="flex items-center">
                            {/* Giá gốc bị gạch ngang và phần trăm giảm giá */}
                            {productData?.discount > 0 ? (
                                <>
                                    <span className="text-gray-500 line-through font-semibold mr-2">
                                        {formatMoney(productData?.price)} VNĐ
                                    </span>
                                    <span className="text-red-600 font-semibold mr-2">-{productData?.discount}%</span>
                                </>
                            ) : (
                                // Nếu không có discount, chỉ hiển thị giá gốc
                                <span className="text-main text-[22px] py-5 font-semibold">
                                    {formatMoney(productData?.price)} VNĐ
                                </span>
                            )}
                        </div>
                        {/* Hiển thị Giá Sau Giảm (nếu có) */}
                        {productData?.discountPrice && productData?.discountPrice > 0 && productData?.discount > 0 && (
                            <span className="text-main text-[22px] py-2 font-semibold">
                                {formatMoney(productData?.discountPrice)} VNĐ
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(Product));
