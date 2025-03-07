import {configureStore} from '@reduxjs/toolkit';
import {sidebarSlice} from './reducers/sidebarSlice';
import { localDataSlice } from './reducers/localDataReducer';
import { modalsSlice } from './reducers/modalsSlice';
import {toastSlice} from './reducers/toastSlice';
import APIResponseSlice from './reducers/APIResponseSlice';

export type reducers = {
    sideBar: typeof sidebarSlice
    localData: typeof localDataSlice
    modalsSlice: typeof modalsSlice
    toastSlice: typeof toastSlice
    APIResponse: typeof APIResponseSlice
}

export const store = configureStore({
    reducer:{
        sideBar: sidebarSlice.reducer,
        localData: localDataSlice.reducer,
        modalsSlice: modalsSlice.reducer,
        toastSlice: toastSlice.reducer,
        APIResponse: APIResponseSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch