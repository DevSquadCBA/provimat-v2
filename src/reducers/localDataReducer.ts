import { createSlice } from "@reduxjs/toolkit/react";
import { LocalData } from "@/interfaces/interfaces";
import { EntityList,  SaleStates } from "@/interfaces/enums";
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
    newSaleData: {
        clientId: 0,
        state: SaleStates.presupuesto,
        total: 0,
        paid: 0,
        budgetDetails: "",
        dispatch: 'without',
        seller: "",
        billing: "",
        estimatedDays: 0,
        deadline: null,
        entity: EntityList.muebles,
        createdAt: "",
        updatedAt: "string",
        products: [],
    }, 
    adminToken: "",
    selectedFiscalCategory: null,
    selectedRole: null

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
        removeSaleFromSales(state, action) {
            state.sales = state.sales.filter((sale) => sale.id !== action.payload);
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
        },
        setAdminToken(state, action) {
            state.adminToken = action.payload;
        },
        cleanAdminToken(state) {
            state.adminToken = "";
        },
        updateNewSaleData(state, action) {
            state.newSaleData = action.payload;
            if(state.newSaleData)
                state.newSaleData.total = state.newSaleData?.products.reduce((acc, product) => acc + (parseInt(product?.total?.toString() || '0')), 0);
        },
        removeNewSaleData(state){
            state.newSaleData =  {
                clientId: 0,
                state: SaleStates.presupuesto,
                total: 0,
                paid: 0,
                budgetDetails: "",
                dispatch: 'without',
                seller: "",
                billing: "",
                estimatedDays: 0,
                deadline: null,
                entity: EntityList.muebles,
                createdAt: "",
                updatedAt: "string",
                products: [],
            };
        },
        addQtyToProductinNewSaleData(state, action:{payload:{index: number}}){
            if (!state.newSaleData) return;
            const products = [...state.newSaleData.products];
            const foundProduct = products[action.payload.index];
            const newQty = (foundProduct.quantity || 0) + 1;
            products[action.payload.index] = {
                ...foundProduct,
                quantity: newQty,
                total: +(((foundProduct.quantity || 0) * (foundProduct.salePrice)) * (foundProduct.discount || 1)).toFixed(2)
            };
            state.newSaleData.products = products;
            state.newSaleData.total = state.newSaleData?.products.reduce((acc, product) => acc + (parseInt(product?.total?.toString() || '0')), 0);
        },
        removeProductFromNewSaleData(state, action:{payload:{index: number}}){
            if (!state.newSaleData) return;
            const products = [...state.newSaleData.products];
            products.splice(action.payload.index, 1);
            state.newSaleData.products = products;
            state.newSaleData.total = state.newSaleData?.products.reduce((acc, product) => acc + (parseInt(product?.total?.toString() || '0')), 0);
        },
        addDiscountToProduct(state, action:{payload:{index: number, discount: number}}){
            if(!state.newSaleData) return;
            const products = [...state.newSaleData.products];
            const foundProduct = products[action.payload.index];
            //const discount = foundProduct.discount || 0;
            const newDiscount = action.payload.discount;
            products[action.payload.index] = {
                ...foundProduct,
                discount: newDiscount,
                total: +(((foundProduct.quantity || 0) * (foundProduct.salePrice)) * newDiscount).toFixed(2)
            };
            state.newSaleData.products = products;
            state.newSaleData.total = state.newSaleData?.products.reduce((acc, product) => acc + (parseInt(product?.total?.toString() || '0')), 0);
        },
        setSelectedFiscalCategory: (state, action) => {
            state.selectedFiscalCategory = action.payload;
        },
        cleanSelectedFiscalCategory: (state) => {
            state.selectedFiscalCategory = null;
        },
        setSelectedRole: (state, action) => {
            state.selectedRole = action.payload;
        },
        cleanSelectedRole: (state) => {
            state.selectedRole = null;
        }, 
    },
})



export const { 
    setProducts,
    setClients,
    setProviders,
    setSales,
    removeSaleFromSales,
    setTeam,
    setSalesProducts,
    setProductLastUpdated,
    setClientLastUpdated,
    setProviderLastUpdated,
    setSaleLastUpdated,
    setSaleProductLastUpdated,
    setAdminToken,
    cleanAdminToken,
    updateNewSaleData,
    addQtyToProductinNewSaleData,
    removeNewSaleData,
    removeProductFromNewSaleData,
    addDiscountToProduct,
    setSelectedFiscalCategory,
    cleanSelectedFiscalCategory,
    setSelectedRole,
    cleanSelectedRole,
    getData 
} = localDataSlice.actions;