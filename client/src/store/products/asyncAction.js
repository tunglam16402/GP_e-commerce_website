import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getNewProducts = createAsyncThunk('product/newProducts', async (data, { RejectedWithValue }) => {
    const response = await apis.apiGetProducts({ sort: '-createdAt' });
    if (!response.success) { 
        return RejectedWithValue(response);
    }
    return response.products;
});
