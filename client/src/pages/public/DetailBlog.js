
import { apiGetDetailBlog, apiLikeBlog, apiDislikeBlog } from 'apis/blog';
import { Breadcrumbs } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const DetailBlog = () => {
    const { bid, title } = useParams(); 
    const [blog, setBlog] = useState(null); 
    const [likes, setLikes] = useState(0); 
    const [dislikes, setDislikes] = useState(0); 
    const [isLiked, setIsLiked] = useState(false); 
    const [isDisliked, setIsDisliked] = useState(false); 

    // Lấy dữ liệu blog từ API
    const fetchBlogs = async () => {
        try {
            const response = await apiGetDetailBlog(bid);
            if (response.success) {
                setBlog(response.response); 
                setLikes(response.response.likes.length);
                setDislikes(response.response.dislikes.length);
                setIsLiked(response.response.likes.includes(bid));
                setIsDisliked(response.response.dislikes.includes(bid));
            } else {
                console.error('Failed to fetch blog data');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
        }
    };

    useEffect(() => {
        if (bid) {
            fetchBlogs();
        }
    }, [bid]);

    const handleLike = async () => {
        try {
            const response = await apiLikeBlog(bid);
            if (response.success) {
                setLikes(response.response.likes.length);
                setDislikes(response.response.dislikes.length);
                setIsLiked(true);
                setIsDisliked(false);

                fetchBlogs();
            }
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    };

    const handleDislike = async () => {
        try {
            const response = await apiDislikeBlog(bid);
            if (response.success) {
                setLikes(response.response.likes.length);
                setDislikes(response.response.dislikes.length);
                setIsDisliked(true);
                setIsLiked(false);

                fetchBlogs();
            }
        } catch (error) {
            console.error('Error disliking blog:', error);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="h-[140px] flex flex-col justify-center items-center bg-gray-100 border-b border-gray-300 shadow-md">
                <div className="w-main">
                    <h3 className="font-extrabold text-[32px] uppercase text-gray-800 tracking-wide">Blogs</h3>
                    <Breadcrumbs blog={blog} />
                </div>
            </div>

            {/* Blog Section */}
            <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-8">
                {/* Blog Container */}
                <div className="w-main mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
                    {/* Image */}
                    <div className="w-full h-[500px] bg-gray-200 overflow-hidden">
                        <img
                            src={blog?.images?.[0] || 'https://via.placeholder.com/1920x800'}
                            alt="Blog"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12">
                        {/* Title */}
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {title || blog?.title || 'No Title'}
                        </h1>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center text-gray-600  lg:text-base space-x-6 mb-8">
                            <span>
                                <strong>Author:</strong> {blog?.author || 'Unknown'}
                            </span>
                            <span>
                                <strong>Published:</strong>{' '}
                                {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                            <span>
                                <strong>Views:</strong> {blog?.numberViews || 0}
                            </span>
                        </div>

                        {/* Description */}
                        <div
                            className="text-gray-700 text-lg lg:text-xl leading-relaxed mb-10"
                            dangerouslySetInnerHTML={{
                                __html: blog?.description || '<p>No content available.</p>',
                            }}
                        />

                        {/* Like & Dislike */}
                        <div className="flex items-center space-x-6 border-t pt-6">
                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                className={`flex items-center text-green-600 hover:text-green-700 transition ${
                                    isLiked ? 'font-semibold' : ''
                                }`}
                            >
                                <FaThumbsUp className="h-7 w-7 lg:h-8 lg:w-8" />
                                <span className="ml-2 lg:ml-3 text-lg lg:text-xl">
                                    {likes} Like{likes > 1 ? 's' : ''}
                                </span>
                            </button>

                            {/* Dislike Button */}
                            <button
                                onClick={handleDislike}
                                className={`flex items-center text-red-600 hover:text-red-700 transition ${
                                    isDisliked ? 'font-semibold' : ''
                                }`}
                            >
                                <FaThumbsDown className="h-7 w-7 lg:h-8 lg:w-8" />
                                <span className="ml-2 lg:ml-3 text-lg lg:text-xl">
                                    {dislikes} Dislike{dislikes > 1 ? 's' : ''}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(DetailBlog);
