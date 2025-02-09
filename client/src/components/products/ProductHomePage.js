// import { apiGetProducts } from 'apis';
// import withBaseComponent from 'hocs/withBaseComponent';
// import React, { useEffect, useState } from 'react';
// import Masonry from 'react-masonry-css';
// import { Product } from 'components';

// const breakpointColumnsObj = {
//     default: 5,
//     1100: 3,
//     700: 2,
//     500: 1,
// };

// const ProductHomePage = () => {
//     const [product, setProduct] = useState(null);

//     const fetchProducts = async () => {
//         const response = await apiGetProducts({ sort: '-sold' });
//         console.log(response);
//         if (response.success) {
//             setProduct(response);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     return (
//         <div className="w-main">
//             <h3 className="text-4xl font-semibold text-gray-900 py-6 border-b-4 border-main uppercase tracking-widest">
//                 Best choice
//             </h3>
//             <div className="mt-4 w-main m-auto">
//                 <Masonry
//                     breakpointCols={breakpointColumnsObj}
//                     className="my-masonry-grid flex mx-[-10px]"
//                     columnClassName="my-masonry-grid_column mb-[-20px]"
//                 >
//                     {product?.products?.map((element) => (
//                         <Product
//                             key={element._id}
//                             pid={element._id}
//                             productData={element}
//                             normal={true}
//                             imageWidth={200}
//                             imageHeight={180}
//                         ></Product>
//                     ))}
//                 </Masonry>
//             </div>
//         </div>
//     );
// };

// export default withBaseComponent(ProductHomePage);

// import { apiGetProducts } from 'apis';
// import withBaseComponent from 'hocs/withBaseComponent';
// import React, { useEffect, useState } from 'react';
// import Masonry from 'react-masonry-css';
// import { Product } from 'components';
// import { useSelector } from 'react-redux';

// const breakpointColumnsObj = {
//     default: 5,
//     1100: 3,
//     700: 2,
//     500: 1,
// };

// const ProductHomePage = () => {
//     const [products, setProducts] = useState(null);
//     const lastViewedCategory = useSelector((state) => state.products.lastViewedCategory); // ✅ Lấy category đúng cách

//     const fetchProducts = async () => {
//         if (!lastViewedCategory) return; // ✅ Chỉ fetch khi có category

//         let query = { sort: '-sold', category: lastViewedCategory };

//         try {
//             const response = await apiGetProducts(query);
//             if (response.success) {
//                 setProducts(response.products);
//             }
//         } catch (error) {
//             console.error('Lỗi khi lấy sản phẩm:', error);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, [lastViewedCategory]); // ✅ Gọi API khi category thay đổi

//     return (
//         <div className="w-main">
//             <h3 className="text-4xl font-semibold text-gray-900 py-6 border-b-4 border-main uppercase tracking-widest">
//                 {lastViewedCategory ? `Gợi ý cho bạn (${lastViewedCategory})` : 'Best Choice'}
//             </h3>
//             <div className="mt-4 w-main m-auto">
//                 <Masonry
//                     breakpointCols={breakpointColumnsObj}
//                     className="my-masonry-grid flex mx-[-10px]"
//                     columnClassName="my-masonry-grid_column mb-[-20px]"
//                 >
//                     {products?.map((element) => (
//                         <Product
//                             key={element._id}
//                             pid={element._id}
//                             productData={element}
//                             normal={true}
//                             imageWidth={200}
//                             imageHeight={180}
//                         />
//                     ))}
//                 </Masonry>
//             </div>
//         </div>
//     );
// };

// export default withBaseComponent(ProductHomePage);

import { apiGetProducts } from 'apis';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { Product } from 'components';
import { useSelector } from 'react-redux';

const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1,
};

const ProductHomePage = () => {
    const [products, setProducts] = useState(null);
    const lastViewedCategory = useSelector((state) => state.products.lastViewedCategory);

    const fetchProducts = async (category = null) => {
        let query = { sort: '-sold' };

        if (category) {
            query.category = category;
        }

        try {
            const response = await apiGetProducts(query);
            if (response.success) {
                setProducts(response.products);
            }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
        }
    };

    useEffect(() => {
        if (lastViewedCategory) {
            fetchProducts(lastViewedCategory);
        } else {
            fetchProducts();
        }
    }, [lastViewedCategory]);

    return (
        <div className="w-main">
            <h3 className="text-3xl font-semibold text-gray-900 pb-6 pt-2 border-b-4 border-main uppercase tracking-widest">
                {lastViewedCategory ? `Suggestions for you (${lastViewedCategory})` : 'Best Choice'}
            </h3>
            <div className="mt-4 w-main m-auto">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex mx-[-10px]"
                    columnClassName="my-masonry-grid_column mb-[-20px]"
                >
                    {products?.map((element) => (
                        <Product
                            key={element._id}
                            pid={element._id}
                            productData={element}
                            normal={true}
                            imageWidth={200}
                            imageHeight={180}
                        />
                    ))}
                </Masonry>
            </div>
        </div>
    );
};

export default withBaseComponent(ProductHomePage);
