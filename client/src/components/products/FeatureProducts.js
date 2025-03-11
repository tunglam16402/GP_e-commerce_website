// import React, { memo, useEffect, useState } from 'react';
// import { ProductCard } from 'components';
// import { apiGetProducts } from 'apis';

// const FeatureProducts = () => {
//     const [products, setProducts] = useState(null);

//     const fetchProducts = async () => {
//         const response = await apiGetProducts({ limit: 9, sort: '-totalRatings' });
//         if (response.success) {
//             setProducts(response.products);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, []);
//     return (
//         <div>
//             <div className="w-full">
//                 <h3 className="text-4xl font-semibold text-gray-900 pb-6 pt-2 border-b-4 border-main uppercase tracking-widest">
//                     FEATURE PRODUCTS
//                 </h3>
//                 <div className="flex flex-wrap mt-[15px] mx-[-10px]">
//                     {products?.map((element) => (
//                         <ProductCard
//                             key={element._id}
//                             pid={element._id}
//                             image={element.thumb}
//                             {...element}
//                         ></ProductCard>
//                     ))}
//                 </div>
//                 <div className="grid grid-cols-4 grid-rows-2 gap-4">
//                     <img
//                         src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
//                         alt=""
//                         className="w-full h-full object-cover col-span-2 row-span-2 transition-transform transform duration-500 hover:scale-105 hover:shadow-lg hover:opacity-90 rounded-lg hover:rotate-2 hover:shadow-[#2f2f2f] hover:transition-all"
//                     ></img>
//                     <img
//                         src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
//                         alt=""
//                         className="w-full h-full object-cover col-span-1 row-span-1 transition-transform transform duration-500 hover:scale-105 hover:shadow-lg hover:opacity-90 rounded-lg hover:rotate-2 hover:shadow-[#2f2f2f] hover:transition-all"
//                     ></img>
//                     <img
//                         src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
//                         alt=""
//                         className="w-full h-full object-cover col-span-1 row-span-2 transition-transform transform duration-500 hover:scale-105 hover:shadow-lg hover:opacity-90 rounded-lg hover:rotate-2 hover:shadow-[#2f2f2f] hover:transition-all"
//                     ></img>
//                     <img
//                         src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
//                         alt=""
//                         className="w-full h-full object-cover col-span-1 row-span-1 transition-transform transform duration-500 hover:scale-105 hover:shadow-lg hover:opacity-90 rounded-lg hover:rotate-2 hover:shadow-[#2f2f2f] hover:transition-all"
//                     ></img>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default memo(FeatureProducts);

import React, { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from 'components';
import { apiGetProducts } from 'apis';

const fetchProducts = async () => {
    const response = await apiGetProducts({ limit: 9, sort: '-totalRatings' });
    if (!response.success) throw new Error('Failed to fetch products');
    return response.products;
};

const FeatureProducts = () => {
    const {
        data: products,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['feature-products'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    });

    if (isLoading) return <p className="text-center text-gray-500">Loading products...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load products.</p>;

    return (
        <div>
            <div className="w-full">
                <h3 className="text-4xl font-semibold text-gray-900 pb-6 pt-2 border-b-4 border-main uppercase tracking-widest">
                    FEATURE PRODUCTS
                </h3>
                <div className="flex flex-wrap mt-[15px] mx-[-10px]">
                    {products?.map((element) => (
                        <ProductCard key={element._id} pid={element._id} image={element.thumb} {...element} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(FeatureProducts);
