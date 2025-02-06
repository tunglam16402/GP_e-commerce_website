import React, { memo, useEffect, useState } from 'react';
import icons from '../../utils/icons';
import { colors } from '../../utils/constant';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import path from '../../utils/path';
import { apiGetProducts } from '../../apis';
import useDebounce from '../../hooks/useDebounce';

const { AiOutlineDown } = icons;

const SearchItem = ({ name, activedClick, changeActivedFilter, type = 'checkbox' }) => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [params] = useSearchParams();
    const [selected, setSelected] = useState([]);
    const [bestPrice, setBestPrice] = useState(null);
    const [price, setPrice] = useState({
        from: '',
        to: '',
    });

    const fetchBestPriceProduct = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1 });
        if (response.success) {
            setBestPrice(response.products[0]?.price);
        }
    };

    const handleSelected = (e) => {
        const alreadyEl = selected.find((element) => element === e.target.value);
        if (alreadyEl) {
            setSelected((prev) => prev.filter((element) => element !== e.target.value));
        } else {
            setSelected((prev) => [...prev, e.target.value]);
        }
        changeActivedFilter(null);
    };

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) {
            param.push(i);
        }
        const queries = {};
        for (let i of param) {
            queries[i[0]] = i[1];
        }
        if (selected.length > 0) {
            queries.color = selected.join(',');
            queries.page = 1;
            // if (Number(price.from) > 0) {
            //     queries.from = price.from;
            // }
            // if (Number(price.to) > 0) {
            //     queries.to = price.to;
            // }
        } else {
            delete queries.color;
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        });
    }, [selected]);

    // handle highest product price
    useEffect(() => {
        if (type === 'input') {
            fetchBestPriceProduct();
        }
    }, [type]);

    // handle show alert when over limit
    useEffect(() => {
        if (price.from && price.to && price.from > price.to) {
            alert('From price cannot greater than To price');
        }
    }, [price]);

    const debouncePriceFrom = useDebounce(price.from, 500);
    const debouncePriceTo = useDebounce(price.to, 500);

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) {
            param.push(i);
        }
        const queries = {};
        for (let i of param) {
            queries[i[0]] = i[1];
        }
        if (Number(price.from) > 0) {
            queries.from = price.from;
        } else {
            delete queries.from;
        }
        if (Number(price.to) > 0) {
            queries.to = price.to;
        } else {
            delete queries.to;
        }
        queries.page = 1;
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        });
    }, [debouncePriceFrom, debouncePriceTo]);

    return (
        <div
            className="cursor-pointer py-3 px-8 text-gray-600 relative gap-6 text-sm border-gray-600 border flex justify-center items-center "
            onClick={() => changeActivedFilter(name)}
        >
            <span className="capitalize">{name}</span>
            <AiOutlineDown />
            {activedClick === name && (
                <div className="absolute top-[calc(100%+1px)] left-0 w-fit p-4 border border-gray-400 bg-white min-w-[150px] z-50">
                    {type === 'checkbox' && (
                        <div>
                            <div className="p-8 pb-6 items-center flex justify-between gap-8 border-b-2">
                                <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelected([]);
                                        changeActivedFilter(null);
                                    }}
                                    className="underline hover:text-main"
                                >
                                    Reset
                                </span>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-2 mt-4">
                                {colors.map((element, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded bg-gray-300 border-gray-100"
                                            value={element}
                                            onChange={handleSelected}
                                            id={element}
                                            checked={selected.some((selectedItem) => selectedItem === element)}
                                        ></input>
                                        <label htmlFor={element} className="text-gray-700 capitalize">
                                            {element}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {type === 'input' && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 pb-6 items-center flex justify-between gap-8 border-b-2">
                                <span className="whitespace-nowrap">{`The highest price is ${Number(
                                    bestPrice,
                                ).toLocaleString()} VND`}</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPrice({ from: '', to: '' });
                                        changeActivedFilter(null);
                                    }}
                                    className="underline hover:text-main"
                                >
                                    Reset
                                </span>
                            </div>
                            <div className="flex items-center gap-2 p-2">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="from">From</label>
                                    <input
                                        className="h-[40px] w-[128px] text-[18px] px-2 font-semibold bg-gray-100"
                                        type="number"
                                        id="from"
                                        value={price.from}
                                        onChange={(e) => setPrice((prev) => ({ ...prev, from: e.target.value }))}
                                    ></input>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="to">To</label>
                                    <input
                                        className="h-[40px] w-[128px] text-[18px] px-2 font-semibold bg-gray-100"
                                        type="number"
                                        id="to"
                                        value={price.to}
                                        onChange={(e) => setPrice((prev) => ({ ...prev, to: e.target.value }))}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(SearchItem);
