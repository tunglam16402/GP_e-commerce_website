// import React, { useEffect, useState } from 'react';
// import Masonry from 'react-masonry-css';
// import { Product } from 'components';
// import { apiGetSameOrderProduct, apiGetProducts } from 'apis';
// import withBaseComponent from 'hocs/withBaseComponent';

// const breakpointColumnsObj = {
//     default: 5,
//     1100: 3,
//     700: 2,
//     500: 1,
// };

// const BoughtTogetherHome = () => {
//     const [products, setProducts] = useState([]);
//     const [pid, setPid] = useState(null);

//     useEffect(() => {
//         const fetchBestSellers = async () => {
//             try {
//                 const response = await apiGetProducts({ sort: '-sold', limit: 10 });
//                 if (response?.success && response.products.length > 0) {
//                     const bestSellerPids = response.products.map((p) => p._id);
//                     console.log('Top 10 best-selling products:', bestSellerPids);
//                     setPid(bestSellerPids);
//                 }
//             } catch (error) {
//                 console.error('❌ Error fetching best-selling products:', error);
//             }
//         };

//         fetchBestSellers();
//     }, []);

//     useEffect(() => {
//         if (!pid || pid.length === 0) return;

//         const fetchBoughtTogether = async () => {
//             try {
//                 if (!pid || pid.length === 0) return;

//                 let productFrequency = {};

//                 for (const productId of pid) {
//                     const response = await apiGetSameOrderProduct(productId, { limit: 10 });
//                     if (response?.success) {
//                         console.log(`Sản phẩm đang phân tích: ${productId}`);
//                         console.log('Sản phẩm được gợi ý mua kèm:', response.recommendedProducts);
//                         response.recommendedProducts.forEach((product) => {
//                             const pId = product._id;
//                             productFrequency[pId] = productFrequency[pId] || { count: 0, product };
//                             productFrequency[pId].count += 1;
//                         });
//                     }
//                 }

//                 // Sort by the number of occurrences (prioritizing frequently bought-together items)
//                 const sortedProducts = Object.values(productFrequency)
//                     .sort((a, b) => b.count - a.count) // Sort in descending order
//                     .map((entry) => entry.product); // Extract the list of products
//                 console.log(' Sản phẩm được chọn để hiển thị:', sortedProducts);
//                 setProducts(sortedProducts);
//             } catch (error) {
//                 console.error('❌ Error fetching Bought Together data:', error);
//             }
//         };

//         fetchBoughtTogether();
//     }, [pid]);

//     return (
//         <div className="w-full">
//             <h3 className="text-3xl font-semibold text-gray-900 pb-6 pt-2 border-b-4 border-main uppercase tracking-widest">
//                 Frequently Bought Together
//             </h3>
//             <div className="mt-4 w-full m-auto">
//                 <Masonry
//                     breakpointCols={breakpointColumnsObj}
//                     className="my-masonry-grid flex mx-[-10px]"
//                     columnClassName="my-masonry-grid_column mb-[-20px]"
//                 >
//                     {products.length > 0 ? (
//                         products.map((product) => (
//                             <Product
//                                 key={product._id}
//                                 pid={product._id}
//                                 productData={product}
//                                 normal={true}
//                                 imageWidth={200}
//                                 imageHeight={180}
//                             />
//                         ))
//                     ) : (
//                         <p className="text-center text-gray-500">No recommendations available.</p>
//                     )}
//                 </Masonry>
//             </div>
//         </div>
//     );
// };

// export default withBaseComponent(BoughtTogetherHome);

import React from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import Masonry from 'react-masonry-css';
import { Product } from 'components';
import { apiGetSameOrderProduct, apiGetProducts } from 'apis';
import withBaseComponent from 'hocs/withBaseComponent';

const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1,
};

const BoughtTogetherHome = () => {
    // Fetch danh sách sản phẩm bán chạy nhất
    const { data: bestSellingProducts, isLoading: isLoadingBestSellers } = useQuery({
        queryKey: ['bestSellers'],
        queryFn: async () => {
            const response = await apiGetProducts({ sort: '-sold', limit: 10 });
            return response?.success ? response.products : [];
        },
        staleTime: 5 * 60 * 1000, // Cache 5 phút
    });

    // Fetch sản phẩm được mua kèm dựa trên danh sách bán chạy
    const boughtTogetherQueries = useQueries({
        queries: (bestSellingProducts || []).map((product) => ({
            queryKey: ['boughtTogether', product._id],
            queryFn: async () => {
                const response = await apiGetSameOrderProduct(product._id, { limit: 10 });
                return response?.success ? response.recommendedProducts : [];
            },
            enabled: !!bestSellingProducts, // Chỉ fetch khi có danh sách sản phẩm bán chạy
            staleTime: 5 * 60 * 1000,
        })),
    });

    // Tổng hợp dữ liệu từ nhiều API calls
    const boughtTogetherProducts = React.useMemo(() => {
        const productFrequency = {};

        boughtTogetherQueries.forEach(({ data }) => {
            if (!data) return;
            data.forEach((product) => {
                const pId = product._id;
                if (!productFrequency[pId]) {
                    productFrequency[pId] = { count: 0, product };
                }
                productFrequency[pId].count += 1;
            });
        });

        return Object.values(productFrequency)
            .sort((a, b) => b.count - a.count)
            .map((entry) => entry.product);
    }, [boughtTogetherQueries]);

    return (
        <div className="w-full">
            <h3 className="text-3xl font-semibold text-gray-900 pb-6 pt-2 border-b-4 border-main uppercase tracking-widest">
                Frequently Bought Together
            </h3>
            <div className="mt-4 w-full m-auto">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex mx-[-10px]"
                    columnClassName="my-masonry-grid_column mb-[-20px]"
                >
                    {isLoadingBestSellers || boughtTogetherQueries.some((q) => q.isLoading) ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : boughtTogetherProducts.length > 0 ? (
                        boughtTogetherProducts.map((product) => (
                            <Product
                                key={product._id}
                                pid={product._id}
                                productData={product}
                                normal={true}
                                imageWidth={200}
                                imageHeight={180}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No recommendations available.</p>
                    )}
                </Masonry>
            </div>
        </div>
    );
};

export default withBaseComponent(BoughtTogetherHome);
