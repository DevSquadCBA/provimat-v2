import {configureStore} from '@reduxjs/toolkit';
import {sidebarSlice} from './reducers/sidebarSlice';
import { localDataSlice } from './reducers/localDataReducer';

export type reducers = {
    sideBar: typeof sidebarSlice
}

export const store = configureStore({
    reducer:{
        sideBar: sidebarSlice.reducer,
        localData: localDataSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch