import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { appSlice } from './app/appSlice';
import { userSlice } from './users/userSlice';
import { productSlice } from './products/productSlice';

const commonConfig = {
    storage,
};

const userConfig = {
    ...commonConfig,
    whitelist: ['isLoggedIn', 'token', 'current', 'currentCart'],
    key: 'shop/user',
};

const productConfig = {
    ...commonConfig,
    whitelist: ['dealDaily', 'lastViewedCategory'],
    key: 'shop/deal',
};

export const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        products: persistReducer(productConfig, productSlice.reducer),
        user: persistReducer(userConfig, userSlice.reducer),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: { ignoredActions: ['persist/PERSIST'] } }),
});

export const persistor = persistStore(store);
