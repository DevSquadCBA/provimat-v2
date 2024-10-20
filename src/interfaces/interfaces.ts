import { IProduct, IClient,IProvider, ISale, ISaleProduct } from "./dbModels"

type MenuItems = 'empty'|'clients'| 'products' | 'providers' | 'sales' | 'submenu'
export type MenuView = {
    selectedView:MenuItems,
    previous:MenuItems,
    next:MenuItems
}
export type LocalData = {
    products : IProduct[],
    clients : IClient[],
    providers : IProvider[],
    sales : ISale[],
    salesProducts : ISaleProduct[],
    productLastUpdated: number,
    providerLastUpdated: number,
    clientLastUpdated: number,
    saleLastUpdated: number,
    saleProductLastUpdated: number
}
