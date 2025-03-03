import { apiGetBlog } from 'apis/blog';
import { BlogCard, Breadcrumbs } from 'components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Blogs = () => {
    const [blogs, setBlogs] = useState(null);
    const { blog } = useParams();

    const fetchBlogs = async (queries) => {
        if (blog && blog !== 'blogs') {
            queries.blog = blog;
        }
        const response = await apiGetBlog(queries);
        if (response.success) {
            setBlogs(response.blogs);
        }
    };

    useEffect(() => {
        
        fetchBlogs();
    }, []);

    return (
        <div className="w-full">
            <div className="h-[86px] flex flex-col justify-center items-center bg-gray-100">
                <div className=" w-main">
                    <h3 className="font-semibold text-[26px] uppercase">Blogs</h3>
                    <Breadcrumbs blog={blog}></Breadcrumbs>
                </div>
            </div>
            <div className="w-main py-4 flex justify-between mt-8 m-auto border">
                <div className="container mx-auto">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs?.map((element) => (
                            <BlogCard
                                key={element.id}
                                bid={element.id}
                                title={element.title}
                                description={element.description}
                                author={element.author}
                                images={element.images}
                                likes={element.likes}
                                dislikes={element.dislikes}
                                createdAt={element.createdAt}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blogs;
