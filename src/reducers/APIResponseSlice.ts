import { createSlice } from "@reduxjs/toolkit";

export interface APIResponseState {
    response?: unknown
    loading: boolean,
    error: boolean
    errorMessage: string
}

const initialState: APIResponseState = {
    loading: false,
    error: false,
    errorMessage: '',
    response: null
}

export const APIResponseSlice = createSlice({
    name: "APIResponse",
    initialState,
    reducers: {
        setLoading: (state: APIResponseState, action: { payload: boolean; }) => {
            state.loading = action.payload;
        },
            setError: (state: APIResponseState, action: { payload: boolean; }) => {
            state.error = action.payload;
        },
        setErrorMessage: (state: APIResponseState, action: { payload: string; }) => {
            state.errorMessage = action.payload;
        },
        setResponse: (state: APIResponseState, action: { payload: unknown; }) => {
            state.response = action.payload;
        },
    },
});

export const {
    setLoading,
    setError,
    setErrorMessage,
    setResponse
} = APIResponseSlice.actions;

export default APIResponseSlice.reducer;