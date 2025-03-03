import { IProduct, IClient,IProvider, ISale, ISaleProduct, IUser } from "./dbModels"

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
    team: IUser[],
    productLastUpdated: number,
    providerLastUpdated: number,
    clientLastUpdated: number,
    saleLastUpdated: number,
    saleProductLastUpdated: number
}

export type UserData = {
    username: string|null,
    email: string|null,
    id: number|null,
    role: string|null,
    token: string|null
}
export type IHistorySales ={
    distinctProviders: number;
    grandTotal: number;
    client: IClient,
    products: {
        id: number,
        name: string,
        providerId: number,
        provider: {
            id: number,
            name: string
        },
        SaleProduct: ISaleProduct & { createdAt: string, updatedAt: string }
    },
    createdAt: string|null,
    updatedAt: string 
} & Partial<ISale>