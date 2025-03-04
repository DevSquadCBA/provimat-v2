import { IProduct, IClient,IProvider, ISale, ISaleProduct, IUser } from "./dbModels"

type MenuItems = 'empty'|'clients'| 'products' | 'providers' | 'sales' | 'submenu'
type MenuSubItems = 'empty'|'presupuesto'|'proforma'|'comprobante'
export type MenuView = {
    selectedView:MenuItems,
    previous:MenuItems,
    next:MenuItems,
    submenu: MenuSubItems
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