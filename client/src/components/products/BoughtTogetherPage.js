// import React, { useEffect, useState } from 'react';
// import Masonry from 'react-masonry-css';
// import { Product } from 'components';
// import { useParams } from 'react-router-dom';
// import { apiGetSameOrderProduct } from 'apis';
// import withBaseComponent from 'hocs/withBaseComponent';

// const breakpointColumnsObj = {
//     default: 5,
//     1100: 3,
//     700: 2,
//     500: 1,
// };

// const BoughtTogetherPage = () => {
//     const { pid } = useParams();
//     console.log('📌 Current URL:', window.location.pathname);
//     console.log('🔹 useParams() trả về:', useParams());
//     console.log('🔹 PID từ useParams:', pid);

//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetchBoughtTogether = async () => {
//             if (!pid) {
//                 console.error('PID từ useParams() bị undefined!');
//                 return;
//             }

//             console.log('🔹 Gọi API với PID:', pid);

//             try {
//                 const response = await apiGetSameOrderProduct(pid);
//                 console.log('🔹 Kết quả API:', response);

//                 if (response?.success) {
//                     console.log('🔹 Danh sách sản phẩm nhận được:', response.recommendedProducts);
//                     setProducts(response.recommendedProducts);
//                 } else {
//                     console.error('⚠️ API trả về nhưng không có recommendedProducts:', response);
//                 }
//             } catch (error) {
//                 console.error('❌ Lỗi khi gọi API:', error);
//             }
//         };

//         fetchBoughtTogether();
//     }, [pid]);

//     console.log(products);

//     return (
//         <div className="w-full">
//             <h3 className="text-3xl font-semibold text-gray-900 pb-6 pt-2 border-b-4 border-main uppercase tracking-widest">
//                 Sản phẩm thường được mua cùng nhau
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
//                         <p className="text-center text-gray-500">Không có gợi ý nào.</p>
//                     )}
//                 </Masonry>
//             </div>
//         </div>
//     );
// };

// export default withBaseComponent(BoughtTogetherPage);

import React, { useEffect, useState } from 'react';
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
    const [products, setProducts] = useState([]);
    const [pid, setPid] = useState(null);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await apiGetProducts({ sort: '-sold', limit: 10 });
                if (response?.success && response.products.length > 0) {
                    const bestSellerPids = response.products.map((p) => p._id);
                    console.log('Top 10 best-selling products:', bestSellerPids);
                    setPid(bestSellerPids);
                }
            } catch (error) {
                console.error('❌ Error fetching best-selling products:', error);
            }
        };

        fetchBestSellers();
    }, []);

    useEffect(() => {
        if (!pid || pid.length === 0) return;

        const fetchBoughtTogether = async () => {
            try {
                if (!pid || pid.length === 0) return;

                let productFrequency = {};

                for (const productId of pid) {
                    const response = await apiGetSameOrderProduct(productId, { limit: 10 });
                    if (response?.success) {
                        console.log(`Sản phẩm đang phân tích: ${productId}`);
                        console.log('Sản phẩm được gợi ý mua kèm:', response.recommendedProducts);
                        response.recommendedProducts.forEach((product) => {
                            const pId = product._id;
                            productFrequency[pId] = productFrequency[pId] || { count: 0, product };
                            productFrequency[pId].count += 1;
                        });
                    }
                }

                // Sort by the number of occurrences (prioritizing frequently bought-together items)
                const sortedProducts = Object.values(productFrequency)
                    .sort((a, b) => b.count - a.count) // Sort in descending order
                    .map((entry) => entry.product); // Extract the list of products
                console.log(' Sản phẩm được chọn để hiển thị:', sortedProducts);
                setProducts(sortedProducts);
            } catch (error) {
                console.error('❌ Error fetching Bought Together data:', error);
            }
        };

        fetchBoughtTogether();
    }, [pid]);

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
                    {products.length > 0 ? (
                        products.map((product) => (
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
