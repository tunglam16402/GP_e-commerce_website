import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getCurrent = createAsyncThunk('user/current', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCurrent();
    if (!response.response) {
        console.error('Missing response data');
        return rejectWithValue({ error: 'No data' });
    }
    if (!response.success) {
        return rejectWithValue(response);
    }
    return response.response;
});
