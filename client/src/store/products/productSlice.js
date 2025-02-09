// import { createSlice } from '@reduxjs/toolkit';
// import * as actions from '../products/asyncAction';

// export const productSlice = createSlice({
//     name: 'product',
//     initialState: {
//         newProducts: null,
//         errorMessage: '',
//         dealDaily: null,
//     },
//     reducers: {
//         getDealDaily: (state, action) => {
//             state.dealDaily = action.payload;
//         },
//     },
//     // Code logic xử lý async action
//     extraReducers: (builder) => {
//         builder.addCase(actions.getNewProducts.pending, (state) => {
//             state.isLoading = true;
//         });

//         // Khi thực hiện action login thành công (Promise fulfilled)
//         builder.addCase(actions.getNewProducts.fulfilled, (state, action) => {
//             // Tắt trạng thái loading, lưu thông tin user vào store
//             state.isLoading = false;
//             state.newProducts = action.payload;
//         });

//         // Khi thực hiện action actions thất bại (Promise rejected)
//         builder.addCase(actions.getNewProducts.rejected, (state, action) => {
//             // Tắt trạng thái loading, lưu thông báo lỗi vào store
//             state.isLoading = false;
//             state.errorMessage = action.payload.message;
//         });
//     },
// });

// export const { getDealDaily } = productSlice.actions;

// export default productSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';
// import * as actions from '../products/asyncAction';

// export const productSlice = createSlice({
//     name: 'product',
//     initialState: {
//         newProducts: null,
//         errorMessage: '',
//         dealDaily: null,
//         lastViewedCategory: null, // ⬅ Thêm giá trị mặc định
//     },
//     reducers: {
//         getDealDaily: (state, action) => {
//             state.dealDaily = action.payload;
//         },
//         setLastViewedCategory: (state, action) => {
//             state.lastViewedCategory = action.payload; // ⬅ Cập nhật category khi xem sản phẩm
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

// 🟢 Lấy lastViewedCategory từ localStorage (nếu có)
const initialCategory = localStorage.getItem('lastViewedCategory') || null;

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newProducts: null,
        errorMessage: '',
        dealDaily: null,
        lastViewedCategory: initialCategory, // 🟢 Dùng dữ liệu từ localStorage
    },
    reducers: {
        getDealDaily: (state, action) => {
            state.dealDaily = action.payload;
        },
        setLastViewedCategory: (state, action) => {
            state.lastViewedCategory = action.payload; // 🟢 Cập nhật Redux
            localStorage.setItem('lastViewedCategory', action.payload); // 🔥 Lưu vào localStorage
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
