import {configureStore} from '@reduxjs/toolkit';
import {sidebarSlice} from './reducers/sidebarSlice';

export type reducers = {
    sideBar: typeof sidebarSlice
}

export const store = configureStore({
    reducer:{
        sideBar: sidebarSlice.reducer
    }
})