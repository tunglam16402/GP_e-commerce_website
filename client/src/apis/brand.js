import axios from '../axios';

export const apiCreateBrand = (data) =>
    axios({
        url: '/brand/create-brand',
        method: 'post',
        data,
    });

export const apiGetBrand = (params) =>
    axios({
        url: '/brand/',
        method: 'get',
        params,
    });
export const apiUpdateBrand = (data, bid) =>
    axios({
        url: '/brand/' + bid,
        method: 'put',
        data,
    });
export const apiDeleteBrand = (bid) =>
    axios({
        url: '/brand/' + bid,
        method: 'delete',
    });
