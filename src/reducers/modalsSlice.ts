import { IHistorySales } from "@/interfaces/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";

interface ModalsState {
    modalHistoryVisible: boolean;
    modalHistorySale: IHistorySales | null;
    stateSelected: string;
    modalCreationVisible: boolean;
}

const initialState: ModalsState = {
    modalHistorySale: null,
    stateSelected: '',
    modalHistoryVisible: false,
    modalCreationVisible: false
};

export const modalsSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        changeVisibilityModalHistory: (state, action: PayloadAction<{ modalHistoryVisible: boolean; modalHistorySale: IHistorySales | null }>) => {
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
        changeVisibilityModalCreation: (state, action: PayloadAction<{ modalCreationVisible: boolean }>) => {
            return {
                ...state,
                modalCreationVisible: action.payload.modalCreationVisible,
            };
        }
    },
});

export const { 
    changeState,
    changeVisibilityModalHistory,
    changeVisibilityModalCreation
 } = modalsSlice.actions;

export default modalsSlice.reducer;
