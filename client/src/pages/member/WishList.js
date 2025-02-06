import { Product } from 'components';
import React from 'react';
import { useSelector } from 'react-redux';

const WishList = () => {
    const { current } = useSelector((state) => state.user);
    return (
        // <div className="relative px-4">
        //     <header className="text-3xl font-semibold py-4 border-b border-main">My Wishlist</header>
        //     <div className="p-4 w-full flex flex-wrap gap-4">
        //         {current?.wishlist?.map((element) => (
        //             <div key={element._id}>
        //                 <Product
        //                     pid={element._id}
        //                     productData={element}
        //                     className="bg-white rounded-md drop-shadow flex flex-col pt-3 gap-3 w-[284px]"
        //                 />
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <div className="absolute px-4 bg-gray-100">
            <header className="text-3xl font-semibold py-6 text-main border-b-4 border-main shadow-md">
                My Wishlist
            </header>
            <div className="p-6 w-full flex flex-wrap gap-8 justify-start mt-8">
                {current?.wishlist?.map((element) => (
                    <div key={element._id} className="w-[284px]">
                        <Product
                            pid={element._id}
                            productData={element}
                            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-main transform hover:scale-105 flex flex-col p-4 gap-4 border border-gray-200"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishList;
