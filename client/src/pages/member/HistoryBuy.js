import { apiGetUserOrders } from 'apis';
import { CustomSelect, InputForm, Pagination } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import useDebounce from 'hooks/useDebounce';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { statusOrders } from 'utils/constant';
import clsx from 'clsx';

const HistoryBuy = ({ dispatch, navigate, location }) => {
    const [orders, setOrders] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
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
        const response = await apiGetUserOrders({ ...params, limit: process.env.REACT_APP_LIMIT });
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

    return (
        // <div className="w-full relative px-4">
        //     <header className="text-3xl font-semibold py-4 border-b border-main">History Buy</header>
        //     <div className="flex justify-end items-center">
        //         <form className="w-[45%] grid grid-cols-2 gap-4">
        //             <div className="col-span-1">
        //                 <InputForm
        //                     id="q"
        //                     register={register}
        //                     errors={errors}
        //                     fullWidth
        //                     placeholder="Search Order by title, status,..."
        //                 ></InputForm>
        //             </div>
        //             <div className="flex items-center col-span-1">
        //                 <CustomSelect
        //                     options={statusOrders}
        //                     value={status}
        //                     // onChange={(value) => handleSearchStatus(value)}
        //                     onChange={handleSearchStatus}
        //                     wrapClassname="w-full"
        //                 />
        //             </div>
        //         </form>
        //     </div>
        //     <table className="table-auto mb-6 text-left w-full">
        //         <thead className="font-bold bg-gray-700 text-[14px] text-center text-white">
        //             <tr>
        //                 <th className="px-4 py-2">#</th>
        //                 <th className="px-4 py-2">Products</th>
        //                 <th className="px-4 py-2">Total</th>
        //                 <th className="px-4 py-2">Status</th>
        //                 <th className="px-4 py-2">Created at</th>
        //                 {/* <th className="px-4 py-2">Actions</th> */}
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {orders?.map((element, index) => (
        //                 <tr key={element._id} className="border border-gray-500 text-center">
        //                     <td className="">
        //                         {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT +
        //                             index +
        //                             1}
        //                     </td>
        //                     <td className="text-center max-w-[600px] py-2">
        //                         <span className="grid grid-cols-4 gap-4">
        //                             {element.products?.map((item) => (
        //                                 <span className="flex col-span-2 items-center gap-2" key={item._id}>
        //                                     <img
        //                                         src={item.thumb}
        //                                         alt="thumb"
        //                                         className="w-16 h-16 rounded-md object-cover"
        //                                     ></img>
        //                                     <span className="flex flex-col">
        //                                         <span className="text-main ">{item.title}</span>
        //                                         <span className="flex items-center gap-2">
        //                                             <span>x {item.quantity}</span>
        //                                         </span>
        //                                     </span>
        //                                 </span>
        //                             ))}
        //                         </span>
        //                     </td>
        //                     <td>{element.total}</td>
        //                     <td>{element.status}</td>
        //                     <td>{moment(element.createdAt)?.format('DD/MM/YYYY')}</td>
        //                     {/* <td>
        //                         <span
        //                             onClick={() => setEditProduct(element)}
        //                             className="text-main hover:text-red-900 cursor-pointer px-1 inline-block"
        //                         >
        //                             <FaEdit />
        //                         </span>
        //                         <span
        //                             onClick={() => handleDeleteProduct(element._id)}
        //                             className="text-main hover:text-red-900 cursor-pointer px-1 inline-block"
        //                         >
        //                             <FaTrashAlt />
        //                         </span>
        //                         <span
        //                             onClick={() => setCustomizeVariant(element)}
        //                             className="text-main hover:text-red-900 cursor-pointer inline-block px-1"
        //                         >
        //                             <MdAddToPhotos />
        //                         </span>
        //                     </td> */}
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        //     <div className="w-full flex justify-end">
        //         <Pagination totalCount={counts}></Pagination>
        //     </div>
        // </div>
        <div className="flex">
            <div className="ml-[100px] w-full bg-gray-50 min-h-screen px-6">
                <div className="relative w-full">
                    <header className="text-3xl font-semibold py-6 text-main border-b-4 border-main shadow-md">
                        History Buy
                    </header>
                    <div className="flex justify-end items-center mt-8">
                        <form className="w-[50%] grid grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <InputForm
                                    id="q"
                                    register={register}
                                    errors={errors}
                                    fullWidth
                                    placeholder="Search Order by title, status,..."
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
                        <table className="table-auto w-full text-left">
                            <thead className="font-semibold text-[14px] text-center bg-main text-white">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Products</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created at</th>
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
                                        <td className="px-6 py-4 transition-all duration-300 hover:scale-105">
                                            <div className="grid grid-cols-2 gap-6">
                                                {element.products?.map((item) => (
                                                    <div key={item._id} className="flex gap-4 items-center">
                                                        <img
                                                            src={item.thumb}
                                                            alt="thumb"
                                                            className="w-20 h-20 rounded-md object-cover shadow-md"
                                                        />
                                                        <div className="flex flex-col justify-center">
                                                            <span className="text-main font-semibold break-words max-w-[200px]">
                                                                {item.title}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                x {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold">{element.total}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={clsx(
                                                    element.status === 'Completed' ? 'text-green-500' : 'text-red-500',
                                                )}
                                            >
                                                {element.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {moment(element.createdAt)?.format('DD/MM/YYYY')}
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

export default withBaseComponent(HistoryBuy);
