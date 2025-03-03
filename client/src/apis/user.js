import axios from '../axios';

export const apiRegister = (data) =>
    axios({
        url: '/user/register',
        method: 'post',
        data: data,
        // withCredentials: true
    });
export const apiFinalRegister = (token) =>
    axios({
        url: '/user/finalRegister/' + token,
        method: 'put',
    });
export const apiLogin = (data) => axios({ url: '/user/login', method: 'post', data: data });

export const apiGoogleLogin = (data) => axios({ url: '/user/google-login', method: 'post', data: data });

export const apiForgotPassword = (data) => axios({ url: '/user/forgotpassword', method: 'post', data: data });

export const apiResetPassword = (data) => axios({ url: '/user/resetpassword', method: 'put', data: data });

export const apiChangePassword = (data) => axios({ url: '/user/changepassword', method: 'put', data: data });

export const apiGetCurrent = () => axios({ url: '/user/current', method: 'get' });

export const apiGetUsers = (params) => axios({ url: '/user/', method: 'get', params: params });

export const apiSendMailOrderSuccess = (data) =>
    axios({ url: '/user/send-mail-order-success', method: 'post', data: data });

export const apiUpdateCurrent = (data) => axios({ url: '/user/current', method: 'put', data: data });

export const apiUpdateCart = (data) => axios({ url: '/user/cart', method: 'put', data: data });

export const apiRemoveCart = (pid, color) => axios({ url: `/user/remove-cart/${pid}/${color}`, method: 'delete' });

export const apiUpdateWishlist = (pid) => axios({ url: `/user/wishlist/${pid}`, method: 'put' });

export const apiContactEmail = (data) => axios({ url: `/user/contact/`, method: 'post', data });

//admin
export const apiUpdateUsers = (data, uid) => axios({ url: '/user/' + uid, method: 'put', data: data });

export const apiDeleteUsers = (uid) => axios({ url: '/user/' + uid, method: 'delete' });
