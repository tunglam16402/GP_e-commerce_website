import withBaseComponent from 'hocs/withBaseComponent';
import React from 'react';
import { formatMoney, renderStarFromNumber } from 'utils/helper';

const ProductCard = ({ price, totalRatings, title, image, pid, category, navigate }) => {
    return (
        // <div
        //     onClick={(e) => navigate(`/${category?.toLowerCase()}/${pid}/${title}`)}
        //     className="w-1/3 cursor-pointer flex-auto px-[10px] mb-[20px]"
        // >
        //     <div className="flex w-full border">
        //         <img src={image} alt="product" className="w-[120px] object-contain p-4"></img>
        //         <div className="flex flex-col gap-1 mt-[15px] items-start w-full text-[16px]">
        //             <span className="line-clamp-1 capitalize hover:text-main">{title?.toLowerCase()}</span>
        //             <span className="flex h-4">
        //                 {renderStarFromNumber(totalRatings, 14)?.map((element, index) => (
        //                     <span key={index}>{element}</span>
        //                 ))}
        //             </span>
        //             <span className="">{`${formatMoney(price)} VNĐ`}</span>
        //         </div>
        //     </div>
        // </div>
        <div
            onClick={(e) => navigate(`/${category?.toLowerCase()}/${pid}/${title}`)}
            className="w-1/3 cursor-pointer flex-auto px-4 mb-6"
        >
            <div className="flex w-full border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <img src={image} alt="product" className="w-[120px] h-[120px] object-contain p-4" />
                <div className="flex flex-col gap-2 mt-[10px] items-start w-full text-[16px] p-4">
                    <span className="line-clamp-2 capitalize font-medium text-gray-800 hover:text-main transition-colors duration-200">
                        {title?.toLowerCase()}
                    </span>
                    <div className="flex items-center space-x-1">
                        {renderStarFromNumber(totalRatings, 14)?.map((element, index) => (
                            <span key={index}>{element}</span>
                        ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-800">{`${formatMoney(price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(ProductCard);
