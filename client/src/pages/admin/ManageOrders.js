import { apiGetOrders } from 'apis';
import { CustomSelect, InputForm, Pagination } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import useDebounce from 'hooks/useDebounce';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { statusOrders } from 'utils/constant';
import clsx from 'clsx';
import DetailOrder from './DetailOrder';

const ManageOrders = ({ dispatch, navigate, location }) => {
    const [orders, setOrders] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
    const [seeDetail, setSeeDetail] = useState(null);
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useForm();

    // const q = watch('q');

    const queriesDebounce = useDebounce(watch('q'), 800);

    useEffect(() => {
        if (queriesDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queriesDebounce }).toString(),
            });
        } else {
            navigate({
                pathname: location.pathname,
            });
        }
    }, [queriesDebounce]);

    const status = watch('status');

    const fetchOrders = async (params) => {
        const response = await apiGetOrders({ ...params, limit: process.env.REACT_APP_LIMIT });
        if (response.success) {
            setOrders(response.orders);
            setCounts(response.counts);
        }
    };

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchOrders(searchParams);
    }, [params]);

    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: value ? createSearchParams({ status: value }).toString() : '',
        });
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order,
            ),
        );
    };

    return (
        <div className="flex">
            <div className="w-full flex relative flex-col px-4 min-h-screen">
                {seeDetail && (
                    <div className="inset-0 absolute bg-gray-100 min-h-screen">
                        <DetailOrder
                            seeDetail={seeDetail}
                            setSeeDetail={setSeeDetail}
                            updateOrderStatus={updateOrderStatus}
                        />
                    </div>
                )}
                <div className="w-full">
                    <header className="text-3xl font-semibold py-6 text-main border-b-4 border-main shadow-md">
                        Manage Orders
                    </header>
                    <div className="flex justify-end items-center mt-8">
                        <form className="w-[50%] grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <InputForm
                                    id="q"
                                    register={register}
                                    errors={errors}
                                    fullWidth
                                    placeholder="Search Order by ID, date,OrderBy..."
                                    className="px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-main focus:outline-none transition-all duration-300"
                                />
                            </div>
                            <div className="col-span-1 flex items-center justify-center ">
                                <CustomSelect
                                    options={statusOrders}
                                    value={status}
                                    onChange={handleSearchStatus}
                                    wrapClassname="w-full"
                                    className="border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-main focus:outline-none transition-all duration-300"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="overflow-x-auto mt-8 rounded-lg shadow-md">
                        <table className="table-auto w-full text-left bg-white">
                            <thead className="font-semibold text-[14px] text-center bg-main text-white">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Ordered by</th>
                                    <th className="px-6 py-4">Order date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Update date</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.map((element, index) => (
                                    <tr
                                        key={element._id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                    >
                                        <td className="px-6 py-4 text-center">
                                            {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) *
                                                process.env.REACT_APP_LIMIT +
                                                index +
                                                1}
                                        </td>
                                        <td className="px-6 py-4 text-center ">{element._id}</td>

                                        <td className="px-6 py-4 text-center">
                                            {element?.orderBy
                                                ? `${element.orderBy.lastname || ''} ${
                                                      element.orderBy.firstname || ''
                                                  }`.trim()
                                                : ''}
                                        </td>
                                        <td className="px-6 py-4 text-center ">
                                            {moment(element.createdAt)?.format('HH:mm:ss DD/MM/YYYY')}
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold">
                                            <span
                                                className={clsx(
                                                    element.status === 'Succeed'
                                                        ? 'bg-green-500 text-white'
                                                        : element.status === 'Processing'
                                                        ? 'bg-yellow-500 text-white'
                                                        : element.status === 'Canceled'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-gray-300 text-black',
                                                    'px-3 py-1 rounded-full inline-flex justify-center items-center w-full min-w-[120px]',
                                                )}
                                            >
                                                {element.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center ">
                                            {moment(element.updatedAt || new Date()).format('HH:mm:ss DD/MM/YYYY')}
                                        </td>
                                        <td className="px-6 py-4 text-center ">
                                            <button
                                                onClick={() => setSeeDetail(element)}
                                                className="bg-main text-white py-1 shadow-md transition-colors duration-300 hover:bg-white hover:text-main focus:outline-none focus:ring-2 focus:ring-main focus:ring-opacity-50"
                                            >
                                                See details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full flex justify-end mt-6">
                        <Pagination totalCount={counts} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(ManageOrders);
