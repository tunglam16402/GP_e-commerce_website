import axios from '../axios';

export const apiGetCategories = () => axios({ url: '/productCategory', method: 'get' });

export const apiCreateCategory = (data) =>
    axios({
        url: '/productCategory/create-category',
        method: 'post',
        data,
    });

export const apiDeleteCategory = (pcid) =>
    axios({
        url: '/productCategory/' + pcid,
        method: 'delete',
    });

// export const apiUpdateCategory = (pcid, data) =>
//     axios({
//         url: '/productCategory/' + pcid,
//         method: 'put',
//         data,
//     });
export const apiUpdateCategory = (pcid, data) =>
    axios({
        url: `/productCategory/${pcid}`, // Truyền pcid vào URL
        method: 'put',
        data,
    });
