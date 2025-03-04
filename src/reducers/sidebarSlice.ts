import { createSlice } from "@reduxjs/toolkit/react";
import { MenuView } from "@/interfaces/interfaces";
const initialState: MenuView = {
    selectedView: "clients",
    previous:"empty",
    next:"providers",
    submenu: "empty"
};

export const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setSelectedView: (state, action) => {
            state.previous = action.payload.previous;
            state.selectedView = action.payload.selectedView;
            state.next = action.payload.next;
            state.submenu = action.payload.submenu
        },
    },
})

export const { setSelectedView } = sidebarSlice.actions;