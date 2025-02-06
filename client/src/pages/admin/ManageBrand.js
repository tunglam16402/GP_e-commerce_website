import { apiGetBrand } from 'apis/brand';
import { InputForm, Pagination } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'react-use';

const ManageBrand = ({ navigate, location }) => {
    const [brands, setBrands] = useState(null);
    const [params] = useSearchParams();
    const [counts, setCounts] = useState(0);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = useForm();

    const q = watch('q');

    const fetchBrands = async (params) => {
        const response = await apiGetBrand({ ...params, limit: +process.env.REACT_APP_LIMIT });
        console.log(response);
        if (response.success) {
            setBrands(response.brands);
            setCounts(response.counts);
        }
    };
    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchBrands(searchParams);
    }, [params]);

    return (
        <div className="w-full flex flex-col p-4 relative">
            {/* {editProduct && (
                <div className="inset-0 absolute bg-gray-100 min-h-screen">
                    <UpdateProduct
                        editProduct={editProduct}
                        render={render}
                        setEditProduct={setEditProduct}
                    ></UpdateProduct>
                </div>
            )} */}
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold border-b-2 border-red-500">
                <span>Manage Brands</span>
            </h1>
            <div className="flex justify-end items-center">
                <form className="w-[45%]">
                    <InputForm
                        id="q"
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder="Search products by title, description,..."
                    ></InputForm>
                </form>
            </div>
            <table className="table-auto mb-6 text-left w-full">
                <thead className="font-bold bg-gray-700 text-[14px] text-center text-white">
                    <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Update at</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {brands?.map((element, index) => (
                        <tr key={element._id} className="border border-gray-500 text-center">
                            <td className="">
                                {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT +
                                    index +
                                    1}
                            </td>
                            <td>{element.title}</td>
                            <td>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                            {/* <td>
                                <span
                                    onClick={() => setEditProduct(element)}
                                    className="text-main hover:text-red-900 cursor-pointer px-1 inline-block"
                                >
                                    <FaEdit />
                                </span>
                                <span
                                    onClick={() => handleDeleteProduct(element._id)}
                                    className="text-main hover:text-red-900 cursor-pointer px-1 inline-block"
                                >
                                    <FaTrashAlt />
                                </span>
                                <span
                                    onClick={() => setCustomizeVariant(element)}
                                    className="text-main hover:text-red-900 cursor-pointer inline-block px-1"
                                >
                                    <MdAddToPhotos />
                                </span>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w-full flex justify-end">
                <Pagination totalCount={counts}></Pagination>
            </div>
        </div>
    );
};

export default withBaseComponent(ManageBrand);
