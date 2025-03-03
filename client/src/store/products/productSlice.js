// import { createSlice } from '@reduxjs/toolkit';
// import * as actions from '../products/asyncAction';

// // 🟢 Lấy lastViewedCategory từ localStorage (nếu có)
// const initialCategory = localStorage.getItem('lastViewedCategory') || null;

// export const productSlice = createSlice({
//     name: 'product',
//     initialState: {
//         newProducts: null,
//         errorMessage: '',
//         dealDaily: null,
//         lastViewedCategory: initialCategory, // 🟢 Dùng dữ liệu từ localStorage
//     },
//     reducers: {
//         getDealDaily: (state, action) => {
//             state.dealDaily = action.payload;
//         },
//         setLastViewedCategory: (state, action) => {
//             state.lastViewedCategory = action.payload; // 🟢 Cập nhật Redux
//             localStorage.setItem('lastViewedCategory', action.payload); // 🔥 Lưu vào localStorage
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addCase(actions.getNewProducts.pending, (state) => {
//             state.isLoading = true;
//         });
//         builder.addCase(actions.getNewProducts.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.newProducts = action.payload;
//         });
//         builder.addCase(actions.getNewProducts.rejected, (state, action) => {
//             state.isLoading = false;
//             state.errorMessage = action.payload.message;
//         });
//     },
// });

// export const { getDealDaily, setLastViewedCategory } = productSlice.actions;
// export default productSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import * as actions from '../products/asyncAction';

// 🟢 Lấy dealDaily từ localStorage (nếu có)
const savedDealDaily = JSON.parse(localStorage.getItem('dealDaily')) || null;

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newProducts: null,
        errorMessage: '',
        dealDaily: savedDealDaily,
        lastViewedCategory: localStorage.getItem('lastViewedCategory') || null,
    },
    reducers: {
        getDealDaily: (state, action) => {
            state.dealDaily = action.payload;
            localStorage.setItem('dealDaily', JSON.stringify(action.payload)); // 🔥 Lưu vào localStorage
        },
        setLastViewedCategory: (state, action) => {
            state.lastViewedCategory = action.payload;
            localStorage.setItem('lastViewedCategory', action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getNewProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getNewProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newProducts = action.payload;
        });
        builder.addCase(actions.getNewProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    },
});

export const { getDealDaily, setLastViewedCategory } = productSlice.actions;
export default productSlice.reducer;
