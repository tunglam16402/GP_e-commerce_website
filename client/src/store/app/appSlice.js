import { createSlice } from '@reduxjs/toolkit';
import * as actions from '../app/asyncAction';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
        isLoading: false,
        isShowModal: false,
        modalChildren: null,
        isShowCart: false,
    },
    reducers: {
        // logout: (state) => {
        //     state.isLoading = false;
        // },
        showModal: (state, action) => {
            state.isShowModal = action.payload.isShowModal;
            state.modalChildren = action.payload.modalChildren;
        },
        showCart: (state) => {
            state.isShowCart = state.isShowCart === false ? true : false;
        },
    },
    // Code logic xử lý async action
    extraReducers: (builder) => {
        builder.addCase(actions.getCategories.pending, (state) => {
            state.isLoading = true;
        });

        // Khi thực hiện action login thành công (Promise fulfilled)
        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            // Tắt trạng thái loading, lưu thông tin user vào store
            state.isLoading = false;
            state.categories = action.payload;
        });

        // Khi thực hiện action actions thất bại (Promise rejected)
        builder.addCase(actions.getCategories.rejected, (state, action) => {
            // Tắt trạng thái loading, lưu thông báo lỗi vào store
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    },
});

// eslint-disable-next-line no-empty-pattern
export const { showModal, showCart } = appSlice.actions;

export default appSlice.reducer;
