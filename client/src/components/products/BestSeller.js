import { memo, React, useEffect, useState } from 'react';
import { apiGetProducts } from 'apis/product';
import { Product, CustomSlider } from 'components';
import { getNewProducts } from 'store/products/asyncAction';
import { useDispatch, useSelector } from 'react-redux';

const tabs = [
    { id: 1, name: 'best seller' },
    { id: 2, name: 'new arrivals' },
    // { id: 3, name: 'tablet' },
];

function BestSeller() {
    const [bestSellers, setBestSellers] = useState(null);
    const [activedTab, setActivedTab] = useState(1);
    const [products, setProducts] = useState(null);
    const dispatch = useDispatch();
    const { newProducts } = useSelector((state) => state.products);

    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: '-sold' });
        if (response.success) {
            setBestSellers(response.products);
            setProducts(response.products);
        }
    };

    useEffect(() => {
        fetchProducts();
        dispatch(getNewProducts());
    }, []);

    //handle change tab slider
    useEffect(() => {
        if (activedTab === 1) {
            setProducts(bestSellers);
        }
        if (activedTab === 2) {
            setProducts(newProducts);
        }
    }, [activedTab]);
    return (
        <div>
            <div className="flex text-[20px] ml-[-32px] ">
                {tabs.map((element) => (
                    <span
                        key={element.id}
                        className={`font-semibold uppercase px-8 border-r cursor-pointer text-gray-400 ${
                            activedTab === element.id ? 'text-main' : ''
                        }`}
                        onClick={() => {
                            setActivedTab(element.id);
                        }}
                    >
                        {element.name}
                    </span>
                ))}
            </div>
            <div className="mt-4 border-t-2 mx-[-10px] border-main pt-4">
                <CustomSlider products={products} activedTab={activedTab}></CustomSlider>
            </div>
            <div className="w-full flex gap-4 mt-6">
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
                    alt="banner"
                    className="flex-1 object-contain"
                ></img>
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
                    alt="banner"
                    className="flex-1 object-contain"
                ></img>
            </div>
        </div>
    );
}

export default memo(BestSeller);
