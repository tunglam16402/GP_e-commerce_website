import axios from '../axios';

export const apiCreateOrder = (data) =>
    axios({
        url: '/order/',
        method: 'post',
        data,
    });

export const apiGetOrders = (params) =>
    axios({
        url: '/order/admin',
        method: 'get',
        params,
    });

export const apiGetOrderDetail = (oid) =>
    axios({
        url: '/order/' + oid,
        method: 'get',
    });

export const apiGetUserOrders = (params) =>
    axios({
        url: '/order/',
        method: 'get',
        params,
    });

export const apiUpdateOrderStatus = (oid, status) =>
    axios({
        url: '/order/status/' + oid,
        method: 'put',
        data: { status },
    });
