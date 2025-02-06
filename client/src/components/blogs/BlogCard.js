import withBaseComponent from 'hocs/withBaseComponent';
import moment from 'moment';
import React from 'react';
import icons from 'utils/icons';

const { FaUser, FaCalendarDays, AiFillDislike, AiFillLike } = icons;

const BlogCard = ({ navigate, title, description, author, numberViews, likes, dislikes, images, bid, createdAt }) => {
    return (
        <div className="max-w-sm mx-auto h-[550px] my-8 bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div onClick={(e) => navigate(`/blog/${bid}/${title}`)}>
                <img
                    className="w-full h-64 object-cover cursor-pointer"
                    src={
                        (images && images[0]) ||
                        'https://tse3.mm.bing.net/th?id=OIP.jeIZbiXiDT0YeHnsFCDUEgHaDl&pid=Api&P=0&h=220'
                    }
                    alt="blog"
                />
                <h2 className="text-[18px] flex items-center justify-center uppercase p-5 cursor-pointer font-semibold text-gray-800 break-words text-center hover:text-main transition-colors duration-300">
                    {title}
                </h2>
                <div className="flex justify-center gap-4 items-center text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-2">
                        <span>
                            <FaUser />
                        </span>
                        <p className="font-medium">By {author || 'Admin'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>
                            <FaCalendarDays />
                        </span>
                        <p>{moment(createdAt).format('DD/MM/YYYY')}</p>
                    </div>
                </div>
            </div>
            <div className="px-5 mb-5">
                <div
                    className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{
                        __html: description.length > 100 ? `${description.substring(0, 100)}...` : description,
                    }}
                ></div>
                <div className="flex justify-between items-center mt-5">
                    <div className="text-gray-500 text-sm">
                        <p>{numberViews} views</p>
                    </div>
                    <div className="flex items-center space-x-6 text-gray-500 text-sm">
                        <div className="flex items-center space-x-1">
                            <span className=" text-red-500 ">
                                <AiFillLike />
                            </span>
                            <p>{likes?.length || 0} likes</p>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span>
                                <AiFillDislike />
                            </span>
                            <p>{dislikes?.length || 0} dislikes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(BlogCard);
