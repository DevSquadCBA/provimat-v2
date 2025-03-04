import {configureStore} from '@reduxjs/toolkit';
import {sidebarSlice} from './reducers/sidebarSlice';
import { localDataSlice } from './reducers/localDataReducer';
import { modalsSlice } from './reducers/modalsSlice';

export type reducers = {
    sideBar: typeof sidebarSlice
    localData: typeof localDataSlice
    modalsSlice: typeof modalsSlice
}

export const store = configureStore({
    reducer:{
        sideBar: sidebarSlice.reducer,
        localData: localDataSlice.reducer,
        modalsSlice: modalsSlice.reducer
    },
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch