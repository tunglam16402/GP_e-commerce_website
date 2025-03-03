import { React, useEffect, useState, memo } from 'react';
import icons from 'utils/icons';
import { apiGetProducts } from 'apis/product';
import { formatMoney, renderStarFromNumber, secondsToHms } from 'utils/helper';
import { DealCountDown } from 'components';
import moment from 'moment';
import withBaseComponent from 'hocs/withBaseComponent';

const { AiFillStar, AiOutlineMenu } = icons;

let idInterval;

const DealDaily = ({ dispatch, navigate, t }) => {
    const [dealDaily, setDealDaily] = useState(null);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [expireTime, setExpireTime] = useState(false);

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ sort: '-discount', limit: 20 });
        if (response.success) {
            const randomProduct = response.products[Math.round(Math.random() * 19)]; // 19 thay vì 20 để tránh lỗi
            setDealDaily(randomProduct);
            dispatch({ type: 'product/getDealDaily', payload: randomProduct });

            // Thiết lập thời gian hết hạn là 24h (lưu vào localStorage)
            const expiryTime = new Date().getTime() + 24 * 3600 * 1000;
            localStorage.setItem('dealExpiryTime', expiryTime);

            const seconds = expiryTime - new Date().getTime();
            const number = secondsToHms(seconds);
            setHour(number.h);
            setMinute(number.m);
            setSecond(number.s);
        }
    };

    useEffect(() => {
        const savedDeal = JSON.parse(localStorage.getItem('dealDaily'));
        const expiryTime = localStorage.getItem('dealExpiryTime');

        if (savedDeal && expiryTime && new Date().getTime() < expiryTime) {
            setDealDaily(savedDeal);
            const seconds = expiryTime - new Date().getTime();
            const number = secondsToHms(seconds);
            setHour(number.h);
            setMinute(number.m);
            setSecond(number.s);
        } else {
            fetchDealDaily();
        }
    }, [expireTime]);

    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) {
                setSecond((prev) => prev - 1);
            } else if (minute > 0) {
                setMinute((prev) => prev - 1);
                setSecond(59);
            } else if (hour > 0) {
                setHour((prev) => prev - 1);
                setMinute(59);
                setSecond(59);
            } else {
                setExpireTime(!expireTime);
            }
        }, 1000);

        return () => clearInterval(idInterval);
    }, [second, minute, hour, expireTime]);

    return (
        <div className="w-full border flex-auto">
            <div className="flex items-center justify-between p-4 w-full">
                <span className="flex-1 flex justify-center">
                    <AiFillStar size={20} color="#DD1111" />
                </span>
                <span className="flex-8 text-[24px] flex justify-center text-gray-700">
                    {t('deal_daily.DEAL_DAILY')}
                </span>
                <span className="flex-1"></span>
            </div>

            <div className="w-full flex flex-col items-center pt-8 px-4">
                <img
                    src={
                        dealDaily?.thumb ||
                        'https://tse3.mm.bing.net/th?id=OIP.uOQ047yW1qXUtl2dpGhwvQHaHa&pid=Api&P=0&h=220'
                    }
                    alt="Product img"
                    className="w-full object-contain"
                />

                <span className="line-clamp-2 text-xl mt-8 text-center">{dealDaily?.title}</span>

                <span className="flex h-4 pb-8 pt-2">
                    {renderStarFromNumber(dealDaily?.totalRatings, 20)?.map((element, index) => (
                        <span key={index}>{element}</span>
                    ))}
                </span>

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 line-through">{`${formatMoney(dealDaily?.price)} VNĐ`}</span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                            {`- ${dealDaily?.discount}%`}
                        </span>
                    </div>

                    <span className="text-red-600 text-[24px] font-bold mt-1">
                        {`${formatMoney(dealDaily?.discountPrice)} VNĐ`}
                    </span>
                </div>
            </div>

            <div className="px-4 mt-6">
                <div className="flex justify-center gap-2 items-center mb-4">
                    <DealCountDown unit={t('deal_daily.HOURS')} number={hour} />
                    <DealCountDown unit={t('deal_daily.MINUTES')} number={minute} />
                    <DealCountDown unit={t('deal_daily.SECONDS')} number={second} />
                </div>

                <button
                    type="button"
                    className="flex gap-2 items-center justify-center w-full text-white bg-main hover:bg-gray-800 py-2 font-medium"
                    onClick={() =>
                        navigate(`/${dealDaily?.category?.toLowerCase()}/${dealDaily?._id}/${dealDaily?.title}`)
                    }
                >
                    <AiOutlineMenu />
                    <span>{t('deal_daily.OPTIONS')}</span>
                </button>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(DealDaily));
