import React, { memo } from 'react';
import avatarDefault from 'assets/img/avt_default.png';
import moment from 'moment';
import { renderStarFromNumber } from 'utils/helper';
import { useSelector } from 'react-redux';

const Comments = ({ image = avatarDefault, name = 'Anonymous', comment, star, updatedAt }) => {
    const { current } = useSelector((state) => state.user);

    return (
        <div className="flex gap-4 mt-4">
            <div className="flex-none">
                <img
                    src={image || avatarDefault}
                    alt="avatar"
                    className="w-[25px] h-[25px] object-cover rounded-full ml-4"
                />
            </div>
            <div className="flex flex-col flex-auto">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{name}</h3>
                    <span className="text-sm italic mr-4">{moment(updatedAt)?.fromNow()}</span>
                </div>
                <div className="flex flex-col gap-2 pl-4 text-sm my-3 mr-4 border border-gray-300 py-2 bg-gray-100">
                    <span className="flex items-center gap-2 mt-2">
                        <span className="font-semibold">Rate:</span>
                        <span className="flex items-center gap-1">
                            {renderStarFromNumber(star, 20)?.map((element, index) => (
                                <span key={index}>{element}</span>
                            ))}
                        </span>
                    </span>
                    <span className="flex gap-2 mb-2">
                        <span className="font-semibold">Comment:</span>
                        <span className="flex items-center gap-1">{comment}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(Comments);
