import { IHistorySales } from "@/interfaces/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";

interface ModalsState {
    modalHistoryVisible: boolean;
    modalHistorySale: IHistorySales | null;
    stateSelected: string;
    modalCreationVisible: boolean;
    idSaleForModals: number,
    modalPresupuestoToProformaVisible: boolean;
}

const initialState: ModalsState = {
    modalHistorySale: null,
    stateSelected: '',
    modalHistoryVisible: false,
    modalCreationVisible: false,
    idSaleForModals: 0,
    modalPresupuestoToProformaVisible: false
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
        },
        changeVisibilityModalPresupuestoToProforma: (state, action: PayloadAction<{ modalPresupuestoToProformaVisible: boolean, idSaleForModals: number }>) => {
            return {
                ...state,
                modalPresupuestoToProformaVisible: action.payload.modalPresupuestoToProformaVisible,
                idSaleForModals: action.payload.idSaleForModals
            };
        },
        hideAll(){
            return {
                ...initialState
            }
        }
    },
});

export const { 
    changeState,
    hideAll,
    changeVisibilityModalHistory,
    changeVisibilityModalCreation,
    changeVisibilityModalPresupuestoToProforma
 } = modalsSlice.actions;

export default modalsSlice.reducer;
