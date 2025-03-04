import { createSlice } from "@reduxjs/toolkit/react";
import { LocalData } from "@/interfaces/interfaces";
const initialState: LocalData = {
    products: [],
    clients: [],
    providers: [],
    sales: [],
    salesProducts: [],
    team: [],
    productLastUpdated: new Date().getTime(),
    clientLastUpdated: new Date().getTime(),
    providerLastUpdated: new Date().getTime(),
    saleLastUpdated: new Date().getTime(),
    saleProductLastUpdated: new Date().getTime(),
};

export const localDataSlice = createSlice({
    name: "localData",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setClients: (state, action) => {
            state.clients = action.payload;
        },
        setProviders: (state, action) => {
            state.providers = action.payload;
        },
        setSales: (state, action) => {
            state.sales = action.payload;
        },
        setTeam: (state, action) => {
            state.team = action.payload;
        },
        setSalesProducts: (state, action) => {
            state.salesProducts = action.payload;
        },
        setProductLastUpdated: (state, action) => {
            state.productLastUpdated = action.payload;
        },
        setClientLastUpdated: (state, action) => {
            state.clientLastUpdated = action.payload;
        },
        setProviderLastUpdated: (state, action) => {
            state.providerLastUpdated = action.payload;
        },
        setSaleLastUpdated: (state, action) => {
            state.saleLastUpdated = action.payload;
        },
        setSaleProductLastUpdated: (state, action) => {
            state.saleProductLastUpdated = action.payload;
        },
        getData(state) {
            return state;
        }

    },
})

export const { 
    setProducts,
    setClients,
    setProviders,
    setSales,
    setTeam,
    setSalesProducts,
    setProductLastUpdated,
    setClientLastUpdated,
    setProviderLastUpdated,
    setSaleLastUpdated,
    setSaleProductLastUpdated,
    getData } = localDataSlice.actions;