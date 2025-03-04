import { IHistorySales } from "@/interfaces/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";

interface ModalsState {
    modalHistoryVisible: boolean;
    modalHistorySale: IHistorySales | null;
    stateSelected: string;
}

const initialState: ModalsState = {
    modalHistoryVisible: false,
    modalHistorySale: null,
    stateSelected: '',
};

export const modalsSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        changeVisibility: (state, action: PayloadAction<{ modalHistoryVisible: boolean; modalHistorySale: IHistorySales | null }>) => {
            return {
                ...state,
                modalHistoryVisible: action.payload.modalHistoryVisible,
                modalHistorySale: action.payload.modalHistorySale,
                stateSelected: '',
            };
        },
        changeState: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                stateSelected: action.payload,
            };
        },
    },
});

export const { changeVisibility, changeState } = modalsSlice.actions;

export default modalsSlice.reducer;
