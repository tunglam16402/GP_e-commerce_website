import { apiGetBlog } from 'apis/blog';
import { BlogCard, Breadcrumbs, CustomSlider } from 'components';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogLists = () => {
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
            <div className="w-main py-4 flex justify-between m-auto">
                <div className="container mx-auto">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* {blogs?.map((element) => (
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
                        ))} */}
                    </div>
                    <CustomSlider blogs={blogs}></CustomSlider>
                </div>
            </div>
        </div>
    );
};

export default BlogLists;
