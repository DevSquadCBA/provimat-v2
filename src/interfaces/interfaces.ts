import { IProduct, IClient,IProvider, ISale, ISaleProduct, IUser, SaleWithProduct } from "./dbModels"
import { FiscalCategory,SaleStates } from "./enums"

type MenuItems = 'emptyAfter'|'emptyBefore'|'clients'| 'products' | 'providers' | 'sales' | 'submenu'| 'home'
type MenuSubItems = 'empty'|'presupuesto'|'proforma'|'comprobante'
export type MenuView = {
    selectedView:MenuItems,
    previous:MenuItems,
    next:MenuItems,
    submenu: MenuSubItems
}
export type LocalData = {
    products : IProduct[]|null,
    clients : IClient[]|null,
    providers : IProvider[]|null,
    sales : ISale[]|null,
    presupuestos: ISale[]|null,
    proformas: ISale[]|null,
    comprobantes: ISale[]|null,
    salesProducts : ISaleProduct[],
    team: IUser[] |null,
    productLastUpdated: number,
    providerLastUpdated: number,
    clientLastUpdated: number,
    saleLastUpdated: number,
    saleProductLastUpdated: number,
    newSaleData: SaleWithProduct|null,
    adminToken: string,
    selectedFiscalCategory: FiscalCategory| null,
    selectedRole: number | null,
    clientSelected: number | null
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
    granTotal: number;
    client: IClient,
    products: {
        id: number,
        name: string,
        code: number,
        providerId: number,
        salePrice: number,
        provider: {
            id: number,
            name: string
        },
        saleProduct: ISaleProduct & { createdAt: string, updatedAt: string }
    }[],
    createdAt: string|null,
    updatedAt: string 
} & Partial<ISale>

export type TableColumns= {
    isKey: boolean
    order?: boolean
    field: string
    header: string
    filter?: string
    dataType?: 'text' | 'numeric' | 'date' | string | undefined
}

export type StateOption = {
    label: string;
    value: SaleStates;
    weight: number;
}

export type CreateModalProps = {
    header: JSX.Element,
    body: JSX.Element
    primaryButtonEvent: () => void,
    resizable?: boolean,
    footer?: JSX.Element,
    onShow?: () => void,
    onHide?: () => void
}