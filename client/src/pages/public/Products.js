import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { Breadcrumbs, Product, SearchItem, InputSelect, Pagination } from '../../components';
import { apiGetProducts } from '../../apis';
import Masonry from 'react-masonry-css';
import { sorts } from '../../utils/constant';

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
};

const Products = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activedClick, setActivedClick] = useState(null);
    const [params] = useSearchParams();
    const [sort, setSort] = useState('');
    const { category } = useParams();

    const fetchProductsByCategory = async (queries) => {
        if (category && category !== 'products') {
            queries.category = category;
        }
        const response = await apiGetProducts(queries);
        if (response.success) setProduct(response);
    };

    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        let priceQuery = {};
        if (queries.from && queries.to) {
            priceQuery = { $and: [{ price: { gte: queries.from } }, { price: { lte: queries.to } }] };
            delete queries.price;
        } else {
            if (queries.from) {
                queries.price = { gte: queries.from };
            }
            if (queries.to) {
                queries.price = { lte: queries.to };
            }
        }

        delete queries.from;
        delete queries.to;

        fetchProductsByCategory({ ...priceQuery, ...queries });
        window.scrollTo(0, 0);
    }, [params]);

    const changeActivedFilter = useCallback(
        (name) => {
            if (activedClick === name) {
                setActivedClick(null);
            } else {
                setActivedClick(name);
            }
        },
        [activedClick],
    );

    //handle sort by
    const changeValue = useCallback(
        (value) => {
            setSort(value);
        },
        [sort],
    );

    useEffect(() => {
        if (sort) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({ sort }).toString(),
            });
        }
    }, [sort]);

    return (
        <div className="w-full">
            <div className="h-[86px] flex flex-col justify-center items-center bg-gray-100">
                <div className=" w-main">
                    <h3 className="font-semibold text-[26px] uppercase">{category}</h3>
                    <Breadcrumbs category={category}></Breadcrumbs>
                </div>
            </div>
            <div className="w-main p-4 flex justify-between mt-8 m-auto border">
                <div className="w-4/5 flex flex-auto flex-col gap-3">
                    <span className="font-semibold text-sm">Filter by</span>
                    <div className="flex items-center gap-4 mb-2">
                        <SearchItem
                            name="price"
                            activedClick={activedClick}
                            changeActivedFilter={changeActivedFilter}
                            type="input"
                        ></SearchItem>
                        <SearchItem
                            name="color"
                            activedClick={activedClick}
                            changeActivedFilter={changeActivedFilter}
                        ></SearchItem>
                    </div>
                </div>
                <div className="w-1/5 flex flex-col gap-3">
                    <span className="font-semibold text-sm">Filter by</span>
                    <div className="w-full">
                        <InputSelect changeValue={changeValue} value={sort} options={sorts}></InputSelect>
                    </div>
                </div>
            </div>
            <div className="mt-4 w-main m-auto">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex mx-[-10px]"
                    columnClassName="my-masonry-grid_column mb-[-20px]"
                >
                    {product?.products?.map((element) => (
                        <Product key={element._id} pid={element._id} productData={element} normal={true}></Product>
                    ))}
                </Masonry>
            </div>
            <div className="w-main m-auto my-4 flex justify-end">
                <Pagination totalCount={product?.counts}></Pagination>
            </div>
        </div>
    );
};

export default memo(Products);
