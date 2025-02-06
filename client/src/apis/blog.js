import axios from '../axios';

export const apiCreateBlog = (data) =>
    axios({
        url: '/blog/create-blog',
        method: 'post',
        data,
    });

export const apiGetBlog = (params) =>
    axios({
        url: '/blog/',
        method: 'get',
        params,
    });

export const apiGetDetailBlog = (bid, title) =>
    axios({
        url: `/blog/${bid}/${title}`,
        method: 'get',
    });

export const apiUpdateBlog = (data, bid) =>
    axios({
        url: '/blog/' + bid,
        method: 'put',
        data,
    });
export const apiDeleteBlog = (bid) =>
    axios({
        url: '/blog/' + bid,
        method: 'delete',
    });

export const apiLikeBlog = (bid) =>
    axios({
        url: '/blog/like/' + bid,
        method: 'put',
    });

export const apiDislikeBlog = (bid) =>
    axios({
        url: '/blog/dislike/' + bid,
        method: 'put',
    });
    
