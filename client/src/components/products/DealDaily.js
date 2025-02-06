import { React, useEffect, useState, memo } from 'react';
import icons from 'utils/icons';
import { apiGetProducts } from 'apis/product';
import { formatMoney, renderStarFromNumber, secondsToHms } from 'utils/helper';
import { DealCountDown } from 'components';
import moment from 'moment';
import withBaseComponent from 'hocs/withBaseComponent';

const { AiFillStar, AiOutlineMenu } = icons;

let idInterval;

const DealDaily = ({ productData, isNew, normal, navigate, dispatch, location, pid, className }) => {
    const [dealDaily, setDealDaily] = useState(null);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [expireTime, setExpireTime] = useState(false);

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ sort: '-totalRatings', limit: 20 });
        if (response.success) {
            setDealDaily(response.products[Math.round(Math.random() * 20)]);
            //time reset = 5 am
            const today = `${moment().format('MM/DD/YYYY')} 5:00:00`;
            const seconds = new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000;
            const number = secondsToHms(seconds);
            // const h = 24 - new Date().getHours();
            // const m = 60 - new Date().getMinutes();
            // const s = 60 - new Date().getSeconds();
            setHour(number.h);
            setMinute(number.m);
            setSecond(number.s);
        } else {
            setHour(0);
            setMinute(59);
            setSecond(59);
        }
    };

    // useEffect(() => {
    //     fetchDealDaily();
    // }, []);

    useEffect(() => {
        idInterval && clearInterval(idInterval);
        fetchDealDaily();
    }, [expireTime]);

    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) {
                setSecond((prev) => prev - 1);
            } else {
                if (minute > 0) {
                    setMinute((prev) => prev - 1);
                    setSecond(60);
                } else {
                    if (hour > 0) {
                        setHour((prev) => prev - 1);
                        setMinute(60);
                        setSecond(60);
                    } else {
                        setExpireTime(!expireTime);
                    }
                }
            }
        }, 1000);
        return () => {
            clearInterval(idInterval);
        };
    }, [second, minute, hour, expireTime]);

    return (
        <div className="w-full border flex-auto">
            <div className="flex items-center justify-between p-4 w-full">
                <span className="flex-1 flex justify-center">
                    <AiFillStar size={20} color="#DD1111"></AiFillStar>
                </span>
                <span className="flex-8  text-[24px] flex justify-center text-gray-700">DEAL DAILY</span>
                <span className="flex-1"></span>
            </div>
            <div className="w-full flex flex-col items-center pt-8 px-4">
                <img
                    src={
                        dealDaily?.thumb ||
                        'https://tse3.mm.bing.net/th?id=OIP.uOQ047yW1qXUtl2dpGhwvQHaHa&pid=Api&P=0&h=220'
                    }
                    alt="Product img"
                    // className="w-[274px] h-[274px] object-cover"
                    className="w-full object-contain"
                ></img>
                <span className="line-clamp-1 text-center">{dealDaily?.title}</span>
                <span className="flex h-4 pb-8 pt-2">
                    {renderStarFromNumber(dealDaily?.totalRatings, 20)?.map((element, index) => (
                        <span key={index}>{element}</span>
                    ))}
                </span>
                <span className="">{`${formatMoney(dealDaily?.price)} VNĐ`}</span>
            </div>
            <div className="px-4 mt-6">
                <div className="flex justify-center gap-2 items-center mb-4">
                    <DealCountDown unit={'Hours'} number={hour}></DealCountDown>
                    <DealCountDown unit={'Minutes'} number={minute}></DealCountDown>
                    <DealCountDown unit={'Seconds'} number={second}></DealCountDown>
                </div>
                <button
                    type="button"
                    className="flex gap-2 items-center justify-center w-full text-white bg-main hover:bg-gray-800 py-2 font-medium "
                >
                    <AiOutlineMenu></AiOutlineMenu>
                    <span
                        onClick={(e) =>
                            navigate(`/${dealDaily?.category?.toLowerCase()}/${dealDaily?._id}/${dealDaily?.title}`)
                        }
                    >
                        OPTIONS
                    </span>
                </button>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(DealDaily));
