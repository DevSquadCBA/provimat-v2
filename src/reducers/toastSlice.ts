import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastMessage } from "primereact/toast";

interface ToastState {
    messages: ToastMessage[];
}

const initialState: ToastState = {
    messages: [],
};

export const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        showToast: (state, action: PayloadAction<ToastMessage>) => {
            state.messages.push(action.payload);
        },
        clearToasts: (state) => {
            state.messages = [];
        },
    },
});

export const { showToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
